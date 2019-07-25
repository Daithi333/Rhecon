import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, switchMap, map, tap, mergeMap, takeLast } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Group } from './group-model';
import { AuthService } from '../auth/auth.service';
import { ContactsService } from '../consultants/contacts.service';
import { Contact } from '../consultants/contact.model';
import { GroupSearch } from './group-search.model';

interface GroupData {
  id: number;
  groupName: string;
  imageUrl: string;
  userId: number;
}

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

  get groups() {
    return this._groups.asObservable();
  }

  /**
   * Chains together private methods to fetch groups and then their membership.
   * Updates the local list when complete
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

  /**
   * Fetch a group and its membership from DB based on group id
   * @param groupId  - id of the group
   */
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

  /**
   * Add new group to DB and local list
   * @param groupName  - name of the group
   * @param imageUrl - url of the group image
   */
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
          { ...newGroup, userId: userId }
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

  /**
   * Upload a group image file to server
   * @param imageFile - image file to be uploaded
   */
  addImage(imageFile: File) {
    const imageData = new FormData();
    imageData.append('fileUpload', imageFile);

    return this.httpClient.post<{fileUrl: string, filePath: string}>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/file/group_image_upload.php',
      imageData
    );
  }

  /**
   * Update a group on the DB and local list
   * @param groupId  - id of the group
   * @param groupName - updated name for the group
   * @param imageUrl - updated image url for the group
   */
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

  /**
   * Lookup groups and their admins based on groupname input
   * @param groupName - string entered by user in open search
   */
  groupSearchWithAdmin(groupName: string) {
    const groupArr: GroupSearch[] = [];
    return this.groupSearch(groupName).pipe(
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
        return this.contactsService.getContact(group.admin).pipe(
          map(contact => {
            group.admin = contact;
            groupArr.push(group);
            return groupArr;
          })
        );
      })
    );
  }

  // add a group invitation record to the DB
  addInvitation(groupName: string, groupId: number, recipient: string) {
    return this.httpClient.post<{ message: string, dbId: number }>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/invitation/create.php',
      { groupName: groupName, groupId: groupId, recipient: recipient }
    );
  }

  /**
   * Chains together private methods associated with joining a group with a code.
   * Verify the code, add the membership, invalidate the code, fetch the group data, add group to local list
   * @param inviteCode - string entered by the user to join the group
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

  // lets admin hand over the reins to another group member
  changeAdmin(groupId: number, newAdminId: number) {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        return this.httpClient.put(
          'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/group/update_membership.php',
          { userId: userId, groupId: groupId, newAdminId: newAdminId }
        );
      })
    );
  }

  // for admin to remove a group member
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

  // TODO - combine with removeMember() making member id optional and iff() defer() operators
  // for user to remove themselves from a group
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


  // Delete a group. Only an option if user is the only member and admin
  deleteGroup(groupId: number) {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        return this.httpClient.delete(
          `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/group/delete.php?id=${groupId}&userId=${userId}`
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

  /**
   * Retrieve groups from the db with empty membership array
   */
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

  /**
   * Retrieve the members of a group passed in
   * @param group - group object
   */
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

  /**
   * Search for groups based on user input string. Admin id included
   * @param groupName - group name input by user in open search
   */
  private groupSearch(groupName: string) {
    return this.httpClient.get<{[key: number]: GroupData}>(
      `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/group/search.php?groupName=${groupName}`
    ).pipe(
      map(resData => {
        const groups = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            groups.push(
              {
                id: +resData[key].id,
                groupName: resData[key].groupName,
                imageUrl: resData[key].imageUrl,
                admin: +resData[key].userId
              }
            );
          }
        }
        return groups;
      })
    );
  }

  // check validity of an invitation code
  private verifyInvitation(inviteCode: string) {
    return this.httpClient.post<{ id: number, groupId: number }>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/invitation/read_single.php',
      { inviteCode: inviteCode }
    );
  }

  // invalidate an invitation code (after use)
  private invalidateInvitation(invitationId: number) {
    return this.httpClient.post(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/invitation/invalidate.php',
      { id: invitationId }
    );
  }

  // add an non admin member to group
  private addMember(userId: number, groupId: number) {
    return this.httpClient.post<{ id: number }>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/group/create_member.php',
      { userId: userId, groupId: groupId }
    );
  }

}
