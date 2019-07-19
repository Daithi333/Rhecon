import { Injectable } from '@angular/core';
import { BehaviorSubject, of, iif, defer } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Patient } from './patient.model';
import { AuthService } from '../auth/auth.service';

interface PatientData {
  id: number;
  firstName: string;
  lastName: string;
  dob: string;
  notes: string;
  portraitUrl: string;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private _patients = new BehaviorSubject<Patient[]>([]);

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  get patients() {
    return this._patients.asObservable();
  }

  /**
   * Fetch patients from DB based on userId to initialise the local list
   */
  fetchPatients() {
    let userId;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userIdData => {
        if (!userIdData) {
          throw new Error('User not found!');
        }
        userId = userIdData;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        return this.httpClient.get<{[key: number]: PatientData}>(
          `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/patient/read.php?userId=${userId}`
        );
      }),
      map(resData => {
        const patients = [];
        for (const key in resData) {
          if (resData.hasOwnProperty(key)) {
            patients.push(
              new Patient(
                resData[key].id,
                resData[key].firstName,
                resData[key].lastName,
                new Date(resData[key].dob),
                resData[key].portraitUrl,
                resData[key].notes,
                resData[key].userId
              )
            );
          }
        }
        return patients;
      }),
      tap(patients => {
        this._patients.next(patients);
      })
    );
  }

  /**
   * Fetch patient record from DB. Also requires requester id when fetched to populate a
   * request object, (the consultant is not part of the parient record)
   * @param id - the patient record id
   * @param requesterId - initiator of a request object and owner of the patient record
   */
  getPatient(id: number, requesterId?: number) {
    return iif(
      () => !requesterId,
      defer(() => this.authService.userId),
      defer(() => of(requesterId)),
    ).pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found');
        }
        // console.log('getPatient userId:' + userId);
        return this.httpClient.get<PatientData>(
          `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/patient/read_single.php?userId=${userId}&id=${id}`
        );
      }),
      map(patientData => {
        return new Patient(
          id,
          patientData.firstName,
          patientData.lastName,
          new Date(patientData.dob),
          patientData.portraitUrl,
          patientData.notes,
          +patientData.userId
        );
      })
    );
  }

  /**
   * Add patient image file to the server
   * @param imageFile - patient image file
   */
  addImage(imageFile: File) {
    const imageData = new FormData();
    imageData.append('fileUpload', imageFile);

    return this.httpClient.post<{fileUrl: string, filePath: string}>(
      'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/file/portrait_upload.php',
      imageData
    );
  }

  /**
   * Add a new patient to database and local list
   * @param firstName - patient firstname
   * @param lastName - patient lastname
   * @param dob - patient date of birth
   * @param portraitUrl - image url
   * @param notes - patient notes
   */
  addPatient(
    firstName: string,
    lastName: string,
    dob: Date,
    portraitUrl: string,
    notes: string,
  ) {
    let uniqueId: number;
    let newPatient: Patient;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('User not found!');
        }
        newPatient = new Patient(
          null,
          firstName,
          lastName,
          dob,
          portraitUrl,
          notes,
          userId
        );
        return this.httpClient.post<{dbId: number}>(
          'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/patient/create.php',
          { ...newPatient, id: null }
        );
      }),
      switchMap(resData => {
        uniqueId = resData.dbId;
        return this.patients;
      }),
      take(1),
      tap(patients => {
        newPatient.id = uniqueId;
        this._patients.next(patients.concat(newPatient));
      })
    );
  }

  /**
   * Update a patient on db and local list
   */
  updatePatient(
    patientId: number,
    firstName: string,
    lastName: string,
    dob: Date,
    portraitUrl: string,
    notes: string
  ) {
    let updatedPatients: Patient[];
    return this.patients.pipe(
      take(1),
      switchMap(patients => {
        // fetch patients from db if app is reloaded on a page where local list does not get initialised.
        if (!patients || patients.length <= 0) {
          return this.fetchPatients();
        } else {
          return of(patients);
        }
      }),
      switchMap(patients => {
        const updatedPatientIndex = patients.findIndex(p => +p.id === patientId);
        updatedPatients = [...patients];
        const preUpdatePatient = updatedPatients[updatedPatientIndex];
        updatedPatients[updatedPatientIndex] = new Patient(
          preUpdatePatient.id,
          firstName,
          lastName,
          new Date(dob),
          portraitUrl,
          notes,
          preUpdatePatient.userId
        );
        return this.httpClient.put(
          'http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/patient/update.php',
          { ...updatedPatients[updatedPatientIndex] }
        );
      }),
      tap(() => {
        this._patients.next(updatedPatients);
      }));
  }

  /**
   * deactivates a patient on the database and removes from local list
   * @param patientId - id of the patient
   */
  removePatient(patientId: number) {
    return this.httpClient.put(
      `http://davidmcelhill.student.davecutting.uk/php_rest_rhecon/api/patient/close.php/?id=${patientId}`,
      { id: patientId }
    )
    .pipe(
      switchMap(() => {
        return this.patients;
      }),
      take(1),
      tap(patients => {
        this._patients.next(patients.filter(p => p.id !== patientId));
      })
    );
  }

}
