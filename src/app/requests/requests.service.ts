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
                +resData[key].requesterId,
                +resData[key].patientId,
                +resData[key].consultantId,
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
      null,
      title,
      this.authService.userId,
      patientId,
      consultantId,
      notes,
      true,
      null,
      null
    );
    return this.httpClient.post<{dbId: number}>('http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/request/create.php',
      { ...newRequest }
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
          this.authService.userId,
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
  }

  closeRequest(requestId: number) {
    console.log('Request closed');
    return this.httpClient.delete(
      `http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/request/delete.php/?id=${requestId}`
    )
    .pipe(
      switchMap(() => {
        return this.requests;
      }),
      take(1),
      tap(requests => {
        this._requests.next(requests.filter(r => r.id !== requestId));
      })
    );
  }

}
