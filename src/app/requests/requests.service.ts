import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take, map, delay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Request } from './request.model';
import { AuthService } from '../auth/auth.service';
import { PatientsService } from '../patients/patients.service';
import { ConsultantsService } from '../consultants/consultants.service';
import { Patient } from '../patients/patient.model';
import { Consultant } from '../consultants/consultant.model';
import { RequestData } from './request-data.model';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private _requests = new BehaviorSubject<Request[]>(
    [
      new Request(
        1001,
        'Recurring migranes',
        this.authService.userId,
        2,
        4,
        'Patient Jane has visited on a number of occasions complaining of migranes',
        true,
        new Date('2019-05-20'),
        new Date('2019-05-22')
      ),
      new Request(
        1002,
        'Unknown skin condition',
        this.authService.userId,
        1,
        2,
        'Looks like an allergic reaction, but no obvious trigger. Would you agree?',
        true,
        new Date('2019-05-20'),
        new Date('2019-05-22')
      ),
      new Request(
        1003,
        'Joe Bloggs suspected Malaria',
        this.authService.userId,
        3,
        4,
        'Please confirm if these symptoms look like Malaria',
        false,
        new Date('2019-05-18'),
        new Date('2019-05-21')
      ),
      new Request(
        1004,
        'CT scan analysis',
        this.authService.userId,
        4,
        3,
        'We were able to take a CT scan but need some consultation on the diagnosis',
        false,
        new Date('2019-05-18'),
        new Date('2019-05-21')
      )
    ]
  );

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private patientsService: PatientsService,
    private consultantsService: ConsultantsService
  ) {}

  get requests() {
    return this._requests.asObservable();
  }

  // getRequestsWithPatientAndConsultant() {
  //   return this._requests.asObservable()
  //     .pipe(
  //       map(requests => {
  //         console.log(requests);
  //         const requestsWithPatientAndConsultant: RequestData[] = [];
  //         for (const key in requests) {
  //           if (requests.hasOwnProperty(key)) {
  //             let patient: Patient;
  //             let consultant: Consultant;
  //             this.patientsService.getPatient(requests[key].patientId)
  //               .subscribe(pat => {
  //                 patient = pat;
  //                 console.log('Patient id: ' + requests[key].patientId);
  //                 console.log(patient);
  //               });
  //             this.consultantsService.getConsultant(requests[key].consultantId)
  //               .subscribe(cons => {
  //                 consultant = cons;
  //               });
  //             requestsWithPatientAndConsultant.push(
  //               new RequestData(
  //                 requests[key].id,
  //                 requests[key].title,
  //                 requests[key].requestorId,
  //                 patient,
  //                 consultant,
  //                 requests[key].notes,
  //                 requests[key].requestActive,
  //                 requests[key].createdOn,
  //                 requests[key].lastUpdated
  //               )
  //             );
  //           }
  //         }
  //         console.log(requestsWithPatientAndConsultant);
  //         return requestsWithPatientAndConsultant;
  //       })
  //     );
  // }

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
    // this.httpClient.post('https://rhecon-fddbf.firebaseio.com/request.json', { ...newRequest, id: null });
    return this.requests.pipe(
      take(1),
      delay(1000),
      tap(requests => {
        this._requests.next(requests.concat(newRequest));
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

  deleteRequest() {

  }
}
