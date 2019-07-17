import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of, iif, defer } from 'rxjs';
import { take, map, tap, switchMap, mergeMap, takeLast } from 'rxjs/operators';

import { Request } from './request.model';
import { AuthService } from '../auth/auth.service';
import { PatientsService } from '../patients/patients.service';
import { ContactsService } from '../consultants/contacts.service';
import { RequestWithObjects } from './request-with-objects.model';

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
  private _requestsWithObjects = new BehaviorSubject<RequestWithObjects[]>([]);

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private patientsService: PatientsService,
    private contactsService: ContactsService
  ) {}

  get requests() {
    return this._requests.asObservable();
  }

  get requestsWithObjects() {
    return this._requestsWithObjects.asObservable();
  }

  fetchRequestsWithObjects() {
    const requestsArr: RequestWithObjects[] = [];
    return this.fetchRequests().pipe(
      mergeMap(requests => {
        if (!requests || !requests.length) {
          console.log('No requests');
          return of(null);
        }
        return requests.map(request => {
          return request;
        });
      }),
      mergeMap(request => {
        if (!request) {
          return of(null);
        }
        return this.patientsService.getPatient(request.patientId, request.requesterId).pipe(
          map(patient => {
            if (!patient) {
              return of(null);
            }
            request.patientId = patient;
            return request;
          })
        );
      }),
      mergeMap(request => {
        if (!request) {
          return of(null);
        }
        return this.contactsService.getContact(request.requesterId).pipe(
          map(requester => {
            if (!requester) {
              return of(null);
            }
            request.requesterId = requester;
            return request;
          })
        );
      }),
      mergeMap(request => {
        if (!request) {
          return of(null);
        }
        return this.contactsService.getContact(request.consultantId).pipe(
          map(consultant => {
            request.consultantId = consultant;
            requestsArr.push(
              new RequestWithObjects(
                +request.id,
                request.title,
                request.requesterId,
                request.patientId,
                request.consultantId,
                request.notes,
                !!+request.active,
                new Date(request.createdOn),
                new Date(request.updatedOn)
              )
            );
            return requestsArr;
          })
        );
      }),
      takeLast(1),
      tap(requests => {
        // console.log(requests);
        if (requests) {
          this._requestsWithObjects.next(requests);
        }
      })
    );
  }

  getRequestWithObjects(id: number) {
    let requestWithObjects: RequestWithObjects;
    return this.getRequest(id).pipe(
      switchMap(request => {
        return this.patientsService.getPatient(request.patientId, request.requesterId).pipe(
          map(patient => {
            requestWithObjects = new RequestWithObjects(
              +request.id,
              request.title,
              null,
              patient,
              null,
              request.notes,
              !!+request.active,
              new Date(request.createdOn),
              new Date(request.updatedOn)
            );
            return request;
          })
        );
      }),
      switchMap(request => {
        return this.contactsService.getContact(request.requesterId).pipe(
          map(requester => {
            requestWithObjects.requester = requester;
            return request;
          })
        );
      }),
      switchMap(request => {
        return this.contactsService.getContact(request.consultantId).pipe(
          map(consultant => {
            requestWithObjects.consultant = consultant;
            return requestWithObjects;
          })
        );
      }),
    );
  }

  addRequest(
    title: string,
    patientId: number,
    consultantId: number,
    notes: string
  ) {
    let uniqueId: number;
    let newRequest: Request;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        newRequest = new Request(
          null,
          title,
          userId,
          patientId,
          consultantId,
          notes,
          true,
          null,
          null
        );
        return this.httpClient.post<{dbId: number}>('http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/request/create.php',
          { ...newRequest, id: null }
        );
      }),
      switchMap(responseData => {
        uniqueId = responseData.dbId;
        return this.requests;
      }),
      take(1),
      switchMap(requests => {
        newRequest.id = uniqueId;
        this._requests.next(requests.concat(newRequest));
        console.log('Request id: ' + uniqueId);
        return of(uniqueId);
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
          'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/request/update.php',
          { ...updatedRequests[updatedRequestIndex] }
        );
      }),
      tap(() => {
        this._requests.next(updatedRequests);
      }));
  }

  closeRequest(requestId: number) {
    return this.httpClient.put(
      `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/request/close.php/?id=${requestId}`,
      { id: requestId }
    )
    .pipe(
      switchMap(() => {
        return this.requestsWithObjects;
      }),
      take(1),
      tap(requests => {
        requests.find(r => r.id === requestId).active = false;
        this._requestsWithObjects.next(requests);
      })
    );
  }

  deleteRequest(requestId: number) {
    return this.httpClient.delete(
      `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/request/delete.php?id=${requestId}`
    )
    .pipe(
      switchMap(() => {
        return this.requestsWithObjects;
      }),
      take(1),
      tap(requests => {
        this._requestsWithObjects.next(requests.filter(r => r.id !== requestId));
      })
    );
  }

  private fetchRequests() {
    let userType;
    return this.authService.userType.pipe(
      take(1),
      switchMap(userTypeData => {
        userType = userTypeData;
        return this.authService.userId;
      }),
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        return iif(
          () => userType === 'requester',
          defer(() => this.httpClient.get<{[key: number]: RequestData}>(
            `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/request/read.php?requesterId=${userId}`)
          ),
          defer(() => this.httpClient.get<{[key: number]: RequestData}>(
            `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/request/read.php?consultantId=${userId}`)
          )
        );
      }),
      map(resData => {
        const requests: Request[] = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            requests.push(
              new Request(
                +resData[key].id,
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

  private getRequest(id: number) {
    let userType;
    return this.authService.userType.pipe(
      take(1),
      switchMap(userTypeData => {
        userType = userTypeData;
        return this.authService.userId;
      }),
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        return iif(
          () => userType === 'requester',
          defer(() => this.httpClient.get<RequestData>(
            `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/request/read_single.php?requesterId=${userId}&id=${id}`)
          ),
          defer(() => this.httpClient.get<RequestData>(
            `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/request/read_single.php?consultantId=${userId}&id=${id}`)
          )
        );
      }),
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

}
