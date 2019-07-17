import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, switchMap, map, tap, mergeMap, takeLast } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Group } from './group-model';
import { AuthService } from '../auth/auth.service';
import { ContactsService } from '../consultants/contacts.service';
import { Contact } from '../consultants/contact.model';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private _groups = new BehaviorSubject<Group[]>([]);

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private contactsService: ContactsService
  ) {}

  // returns the locally stored list of groups
  get groups() {
    return this._groups.asObservable();
  }

  /**
   * Fetch a list of groups and their members for the local list.
   */
  fetchGroupsWithMembers() {
    const groupArr: Group[] = [];
    return this.fetchGroups().pipe(
      mergeMap(groups => {
        if (!groups || !groups.length) {
          return of(null);
        }
        return groups.map(group => {
          return group;
        });
      }),
      mergeMap(group => {
        if (!group) {
          return of(null);
        }
        return this.fetchMembership(group).pipe(
          takeLast(1),
          map(members => {
            group.members = members;
            groupArr.push(group);
            return groupArr;
          })
        );
      }),
      takeLast(1),
      tap(groups => {
        if (groups) {
          this._groups.next(groups);
        }
      })
    );
  }

  getGroup(groupId: number) {
    let group: Group;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        return this.httpClient.get<Group>(
          `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/group/read_single.php?id=${groupId}&userId=${userId}`
        );
      }),
      map(groupData => {
        group = new Group (
          groupData.id,
          groupData.groupName,
          groupData.imageUrl,
          !!+groupData.isAdmin,
          []
        );
        return group;
      }),
      mergeMap(fetchedGroup => {
        // console.log(fetchedGroup);
        return this.fetchMembership(fetchedGroup).pipe(
          takeLast(1),
          map(members => {
            group.members = members;
            return group;
          })
        );
      })
    );
  }

  addGroup(groupName: string, imageUrl: string) {
    let uniqueId: number;
    let newGroup;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        newGroup = new Group(
          null,
          groupName,
          imageUrl,
          null,
          []
        );
        return this.httpClient.post<{dbId: number, dbId2: number}>(
          'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/group/create.php',
          { ...newGroup, id: null, userId: userId }
        );
      }),
      switchMap(responseData => {
        uniqueId = responseData.dbId;
        return this.groups;
      }),
      take(1),
      switchMap(groups => {
        newGroup.id = uniqueId;
        this._groups.next(groups.concat(newGroup));
        return of(uniqueId);
      })
    );
  }

  addImage(imageFile: File) {
    const imageData = new FormData();
    imageData.append('fileUpload', imageFile);

    return this.httpClient.post<{fileUrl: string, filePath: string}>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/file/group_image_upload.php',
      imageData
    );
  }

  updateGroup(groupId: number, groupName: string, imageUrl: string) {
    let updatedGroups: Group[];
    return this.groups.pipe(
      take(1),
      switchMap(groups => {
        // fetch groups from db if app is reloaded on a page where local list does not get initialised.
        if (!groups || groups.length <= 0) {
          return this.fetchGroupsWithMembers();
        } else {
          return of(groups);
        }
      }),
      switchMap(groups => {
        const updatedGroupIndex = groups.findIndex(g => +g.id === +groupId);
        updatedGroups = [...groups];
        const preUpdateGroup = updatedGroups[updatedGroupIndex];
        updatedGroups[updatedGroupIndex] = new Group(
          preUpdateGroup.id,
          groupName,
          imageUrl,
          preUpdateGroup.isAdmin,
          preUpdateGroup.members
        );
        return this.httpClient.put(
          'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/group/update.php',
          { ...updatedGroups[updatedGroupIndex] }
        );
      }),
      tap(() => {
        this._groups.next(updatedGroups);
      }));
  }

  addInvitation(groupName: string, groupId: number, recipient: string) {
    return this.httpClient.post<{ message: string, dbId: number }>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/invitation/create.php',
      { groupName: groupName, groupId: groupId, recipient: recipient }
    );
  }

  /**
   * Method chains together http calls associated with joining a group with a code.
   * Verify the code, add the membership, invalidate the code, fetch the group data and adds to users view
   * @param inviteCode
   */
  joinWithCode(inviteCode: string) {
    let userId;
    let invitationId;
    let groupId;
    let joinedGroup;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userIdData => {
        if (!userIdData) {
          throw new Error('User not found!');
        }
        userId = +userIdData;
        return this.verifyInvitation(inviteCode);
      }),
      switchMap(resData => {
        invitationId = +resData.id;
        groupId = +resData.groupId;
        return this.addMember(userId, groupId);
      }),
      switchMap(memberIdData => {
        return this.invalidateInvitation(invitationId);
      }),
      switchMap(() => {
        return this.getGroup(groupId);
      }),
      switchMap(group => {
        joinedGroup = group;
        return this.groups;
      }),
      take(1),
      tap(groups => {
        this._groups.next(groups.concat(joinedGroup));
      })
    );
  }

  promoteToAdmin(userId: number, groupId: number) {
    return this.httpClient.put(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/group/update_membership.php',
      { userId: userId, groupId: groupId }
    );
  }

  removeMember(groupId: number, memberId: number) {
    return this.httpClient.delete(
      `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/group/delete_membership.php/?groupId=${groupId}&userId=${memberId}`
    ).pipe(
      switchMap(() => {
        return this.groups;
      }),
      take(1),
      tap(groups => {
        this._groups.next(groups.filter(g => g.id !== groupId));
      })
    );
  }

  leaveGroup(groupId: number) {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        return this.httpClient.delete(
          `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/group/delete_membership.php/?groupId=${groupId}&userId=${userId}`
        );
      }),
      switchMap(() => {
        return this.groups;
      }),
      take(1),
      tap(groups => {
        this._groups.next(groups.filter(g => g.id !== groupId));
      })
    );
  }

  deleteGroup(groupId: number) {
    return this.httpClient.delete(
      `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/group/delete.php?id=${groupId}`
    )
    .pipe(
      switchMap(() => {
        return this.groups;
      }),
      take(1),
      tap(requests => {
        this._groups.next(requests.filter(g => g.id !== groupId));
      })
    );
  }

  private fetchGroups() {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        return this.httpClient.get<{[key: number]: Group}>(
          `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/group/read.php?userId=${userId}`
        );
      }),
      map(resData => {
        const groups: Group[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            groups.push(
              new Group(
                +resData[key].id,
                resData[key].groupName,
                resData[key].imageUrl,
                !!+resData[key].isAdmin,
                []
              )
            );
          }
        }
        return groups;
      }),
      tap(groups => {
        this._groups.next(groups);
      })
    );
  }

  private fetchMembership(group: Group) {
    const members: Contact[] = [];
    return this.httpClient.get<number[]>(
      `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/group/read_membership.php?groupId=${group.id}`
    ).pipe(
      mergeMap(memberIds => {
        return memberIds.map(memberId => {
          return memberId;
        });
      }),
      mergeMap(memberId => {
        return this.contactsService.getContact(+memberId);
      }),
      mergeMap(contact => {
        members.push(contact);
        return of(members);
      })
    );
  }

  private verifyInvitation(inviteCode: string) {
    return this.httpClient.post<{ id: number, groupId: number }>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/invitation/read_single.php',
      { inviteCode: inviteCode }
    );
  }

  private invalidateInvitation(invitationId: number) {
    return this.httpClient.post(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/invitation/invalidate.php',
      { id: invitationId }
    );
  }

  private addMember(userId: number, groupId: number) {
    return this.httpClient.post<{ id: number }>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/group/create_member.php',
      { userId: userId, groupId: groupId }
    );
  }

}
