import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  ) { }

  get patients() {
    return this._patients.asObservable();
  }

  fetchPatients() {
    return this.httpClient.get<{[key: number]: PatientData}>(
      `http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/patient/read.php?userId=${this.authService.userId}`
    )
    .pipe(
      map(resData => {
        // console.log(resData);
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
  // could fethc locally if better performance is needed
  getPatient(id: number) {
    return this.httpClient.get<PatientData>(
      `http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/patient/read_single.php?userId=${this.authService.userId}&id=${id}`
    )
    .pipe(
      map(patientData => {
        return new Patient(
          id,
          patientData.firstName,
          patientData.lastName,
          new Date(patientData.dob),
          patientData.portraitUrl,
          patientData.notes,
          patientData.userId
        );
      })
    );
  }

  addPatient(
    firstName: string,
    lastName: string,
    dob: Date,
    // portraitUrl: string,
    notes: string,
  ) {
    let uniqueId: number;
    const newPatient = new Patient(
      Math.floor(Math.random() * 10000) + 1001,
      firstName,
      lastName,
      dob,
      'https://mymodernmet.com/wp/wp-content/uploads/2018/10/Mou-Aysha-portrait-photography-3.jpg',
      notes,
      this.authService.userId
    );
    return this.httpClient
    .post<{dbId: number}>('http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/patient/create.php',
    { ...newPatient, id: null }
    )
    .pipe(
      switchMap(responseData => {
        uniqueId = responseData.dbId;
        return this.patients;
      }),
      take(1),
      tap(patients => {
        newPatient.id = uniqueId;
        this._patients.next(patients.concat(newPatient));
      })
    );
  }

  updatePatient(
    patientId: number,
    firstName: string,
    lastName: string,
    dob: Date,
    // portraitUrl: string,
    notes: string,
  ) {
    let updatedPatients: Patient[];
    return this.patients.pipe(
      take(1),
      switchMap(patients => {
        const updatedPatientIndex = patients.findIndex(p => p.id === patientId);
        updatedPatients = [...patients];
        const preUpdatePatient = updatedPatients[updatedPatientIndex];
        updatedPatients[updatedPatientIndex] = new Patient(
          preUpdatePatient.id,
          firstName,
          lastName,
          new Date(dob),
          preUpdatePatient.portraitUrl,
          notes,
          preUpdatePatient.userId
        );
        return this.httpClient.put(
          'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/api/patient/update.php',
          { ...updatedPatients[updatedPatientIndex] }
        );
      }), tap(() => {
        this._patients.next(updatedPatients);
      }));
    }

    // return this.patients.pipe(
    //   take(1),
    //   delay(1000),
    //   tap(patients => {
    //     const updatedPatientIndex = patients.findIndex(pt => pt.id === patientId);
    //     const updatedPatients = [...patients];
    //     const preUpdatePatient = updatedPatients[updatedPatientIndex];
    //     updatedPatients[updatedPatientIndex] = new Patient(
    //       preUpdatePatient.id,
    //       firstName,
    //       lastName,
    //       new Date(dob),
    //       preUpdatePatient.portraitUrl,
    //       notes,
    //       preUpdatePatient.userId
    //     );
    //     this._patients.next(updatedPatients);
    //   })
    // );

  deletePatient() {

  }

}
