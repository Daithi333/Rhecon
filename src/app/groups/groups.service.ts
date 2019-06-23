import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Group } from './group-model';
import { AuthService } from '../auth/auth.service';

interface GroupData {
  id: number;
  userId: number;
  groupId: number;
  groupName: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private _groups = new BehaviorSubject<Group[]>([]);

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
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
        return this.httpClient.get<{[key: number]: GroupData}>(
          `http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/group/read.php?userId=${userId}`
        );
      }),
      map(resData => {
        
      })
    );
  }

}
