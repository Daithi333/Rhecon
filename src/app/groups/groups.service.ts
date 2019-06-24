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

  fetchGroups() {
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

  fetchMembership(group: Group) {
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
        return members;
      }),
      takeLast(1),
      tap(() => {
        return members;
      })
    );
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
          map(members => {
            console.log('level 2: ' + group);
            groupArr.push(group);
            return groupArr;
          })
        );
      }),
      tap(groups => {
        return this._groups.next(groups);
      })
    );
  }

}
