import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, delay, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Request } from './request.model';
import { AuthService } from '../auth/auth.service';

// [
//   new Request(
//     1001,
//     'Recurring migranes',
//     this.authService.userId,
//     2,
//     4,
//     'Patient Jane has visited on a number of occasions complaining of migranes',
//     true,
//     new Date('2019-05-20'),
//     new Date('2019-05-22')
//   ),
//   new Request(
//     1002,
//     'Unknown skin condition',
//     this.authService.userId,
//     1,
//     2,
//     'Looks like an allergic reaction, but no obvious trigger. Would you agree?',
//     true,
//     new Date('2019-05-20'),
//     new Date('2019-05-22')
//   ),
//   new Request(
//     1003,
//     'Joe Bloggs suspected Malaria',
//     this.authService.userId,
//     3,
//     4,
//     'Please confirm if these symptoms look like Malaria',
//     false,
//     new Date('2019-05-18'),
//     new Date('2019-05-21')
//   ),
//   new Request(
//     1004,
//     'CT scan analysis',
//     this.authService.userId,
//     4,
//     3,
//     'We were able to take a CT scan but need some consultation on the diagnosis',
//     false,
//     new Date('2019-05-18'),
//     new Date('2019-05-21')
//   )
// ]

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private _requests = new BehaviorSubject<Request[]>([]);

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  get requests() {
    return this._requests.asObservable();
  }

  fetchRequests() {
    return this.httpClient.get(
      `http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/request/read.php?requesterId=${this.authService.userId}`
    ).pipe(
      map(resData => {
        const requests = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            requests.push(
              new Request(
                resData[key].id,
                resData[key].title,
                resData[key].requesterId,
                resData[key].patientId,
                resData[key].consultantId,
                resData[key].notes,
                resData[key].requestActive,
                resData[key].createdOn,
                resData[key].lastUpdated
              )
            );
          }
        }
        return requests;
      }),
      tap(requests => {
        this._requests.next(requests);
        console.log(this._requests.value);
      })
    );
  }

  getRequest(id: number) {
    return this._requests.pipe(take(1),
      map(requests => {
        return { ...requests.find(r => r.id === id) };
      })
    );
  }

  addRequest(
    title: string,
    patientId: number,
    consultantId: number,
    notes: string
  ) {
    let uniqueId: number;
    const newRequest = new Request(
      Math.floor(Math.random() * 10000) + 1001,
      title,
      this.authService.userId,
      patientId,
      consultantId,
      notes,
      true,
      new Date(),
      new Date()
    );
    return this.httpClient.post<{dbId: number}>('http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/request/create.php',
      { ...newRequest, id: null }
    )
    .pipe(
      switchMap(responseData => {
        uniqueId = responseData.dbId;
        return this.requests;
      }),
      take(1),
      tap(patients => {
        newRequest.id = uniqueId;
        this._requests.next(patients.concat(newRequest));
      })
    );
  }

  updateRequest(
    requestId: number,
    title: string,
    patientId: number,
    consultantId: number,
    notes: string
  ) {
    return this.requests.pipe(
      take(1),
      delay(1000),
      tap(requests => {
        const updatedRequestIndex = requests.findIndex(r => r.id === requestId);
        const updatedRequests = [...requests];
        const oldRequest = updatedRequests[updatedRequestIndex];
        updatedRequests[updatedRequestIndex] = new Request(
          oldRequest.id,
          title,
          this.authService.userId,
          patientId,
          consultantId,
          notes,
          true,
          oldRequest.createdOn,
          new Date()
        );
        this._requests.next(updatedRequests);
      })
    );
  }

}
