import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Request } from './request.model';
import { AuthService } from '../auth/auth.service';

interface RequestData {
  id: number;
  title: string;
  requesterId: number;
  patientId: number;
  consultantId: number;
  notes: string;
  active: boolean;
  createdOn: string;
  updatedOn: string;
}

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
    return this.httpClient.get<{[key: number]: RequestData}>(
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
                !!+resData[key].active,
                new Date(resData[key].createdOn),
                new Date(resData[key].updatedOn)
              )
            );
          }
        }
        return requests;
      }),
      tap(requests => {
        this._requests.next(requests);
      })
    );
  }

  getRequest(id: number) {
    return this.httpClient.get<RequestData>(
      `http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/request/read_single.php?requesterId=${this.authService.userId}&id=${id}`
    )
    .pipe(
      map(requestData => {
        return new Request(
          id,
          requestData.title,
          +requestData.requesterId,
          +requestData.patientId,
          +requestData.consultantId,
          requestData.notes,
          !!+requestData.active,
          new Date(requestData.createdOn),
          new Date(requestData.updatedOn)
        );
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
    let updatedRequests: Request[];
    return this.requests.pipe(
      take(1),
      switchMap(requests => {
        // fetch requests from db if user reloads app on a page where local list is not initialised.
        if (!requests || requests.length <= 0) {
          return this.fetchRequests();
        } else {
          return of(requests);
        }
      }),
      switchMap(requests => {
        const updatedRequestIndex = requests.findIndex(r => +r.id === requestId);
        updatedRequests = [...requests];
        const preUpdateRequest = updatedRequests[updatedRequestIndex];
        updatedRequests[updatedRequestIndex] = new Request(
          preUpdateRequest.id,
          title,
          preUpdateRequest.requesterId,
          patientId,
          consultantId,
          notes,
          preUpdateRequest.active,
          new Date(),
          new Date()
        );
        return this.httpClient.put(
          'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/request/update.php',
          { ...updatedRequests[updatedRequestIndex] }
        );
      }),
      tap(() => {
        this._requests.next(updatedRequests);
      }));
    // return this.requests.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(requests => {
    //     const updatedRequestIndex = requests.findIndex(r => r.id === requestId);
    //     const updatedRequests = [...requests];
    //     const oldRequest = updatedRequests[updatedRequestIndex];
    //     updatedRequests[updatedRequestIndex] = new Request(
    //       oldRequest.id,
    //       title,
    //       this.authService.userId,
    //       patientId,
    //       consultantId,
    //       notes,
    //       true,
    //       oldRequest.createdOn,
    //       new Date()
    //     );
    //     this._requests.next(updatedRequests);
    //   })
    // );
  }

}
