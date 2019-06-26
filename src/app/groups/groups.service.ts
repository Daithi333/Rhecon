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

  fetchGroupsWithMembers() {
    const groupArr: Group[] = [];
    return this.fetchGroups().pipe(
      mergeMap(groups => {
        return groups.map(group => {
          return group;
        });
      }),
      mergeMap(group => {
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
        // console.log(groups);
        this._groups.next(groups);
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
          `http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/group/read_single.php?id=${groupId}&userId=${userId}`
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
    return this.httpClient.post<{dbId: number, dbId2: number}>(
      'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/group/create.php',
      { ...newGroup, id: null }
    );
  }

  addImage(imageFile: File) {
    const imageData = new FormData();
    imageData.append('fileUpload', imageFile);

    return this.httpClient.post<{fileUrl: string, filePath: string}>(
      'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/file/group_image_upload.php',
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
          'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/group/update.php',
          { ...updatedGroups[updatedGroupIndex] }
        );
      }),
      tap(() => {
        this._groups.next(updatedGroups);
      }));
  }

  removeMember(memberId: number) {

  }

  private fetchGroups() {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        return this.httpClient.get<{[key: number]: Group}>(
          `http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/group/read.php?userId=${userId}`
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
      `http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/group/read_membership.php?groupId=${group.id}`
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

}
