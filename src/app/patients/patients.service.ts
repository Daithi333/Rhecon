import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, delay, tap } from 'rxjs/operators';

import { Patient } from './patient.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private _patients = new BehaviorSubject<Patient[]>(
    [
      new Patient(
        1,
        'John',
        'Doe',
        new Date ('1980-05-15'),
        'https://www.eharmony.com/blog/wp-content/uploads/2010/04/eHarmony-Blog-profile-picture.jpg',
        'From the neighbouring town',
        1
      ),
      new Patient(
        2,
        'Jane',
        'Doe',
        new Date ('1982-02-30'),
        'https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg',
        'Repeat visitor to the health centre, complains of migraines',
        1
      ),
      new Patient(
        3,
        'Joe',
        'Bloggs',
        new Date ('1995-12-04'),
        'http://goldenayeyarwaddytravels.com/sites/default/files/default_images/default-user-icon-8.jpg',
        '',
        1
      ),
      new Patient(
        4,
        'Jess',
        'Briggs',
        new Date ('1990-08-31'),
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSodylrg6Lyn15aQMFE9K8ZOGwQ1ZDbBBUJu6DAwO4Xmg1_B53B',
        '',
        1
      )
    ]
  );

  constructor(private authService: AuthService) { }

  get patients() {
    return this._patients.asObservable();
  }

  getPatient(id: number) {
    return this._patients.pipe(take(1),
      map(patients => {
        return  { ...patients.find(p => p.id === id) };
      })
    );
  }

  addPatient(
    firstName: string,
    lastName: string,
    dob: Date,
    // potraitUrl: string,
    notes: string,
  ) {
    const newPatient = new Patient(
      Math.floor(Math.random() * 10000) + 1001,
      firstName,
      lastName,
      new Date(dob),
      'https://mymodernmet.com/wp/wp-content/uploads/2018/10/Mou-Aysha-portrait-photography-3.jpg',
      notes,
      this.authService.userId
    );
    // returned for new-patient loading controller to know when completed.
    // take allows observation without consuming the Observable
    return this.patients.pipe(
      take(1),
      delay(1000),
      tap(patients => {
        this._patients.next(patients.concat(newPatient));
      })
    );
  }

  updatePatient(
    patientId: number,
    firstName: string,
    lastName: string,
    dob: Date,
    // potraitUrl: string,
    notes: string,
  ) {
    return this.patients.pipe(
      take(1),
      delay(1000),
      tap(patients => {
        const updatedPatientIndex = patients.findIndex(pt => pt.id === patientId);
        const updatedPatients = [...patients];
        const preUpdatePatient = updatedPatients[updatedPatientIndex];
        updatedPatients[updatedPatientIndex] = new Patient(
          preUpdatePatient.id,
          firstName,
          lastName,
          new Date(dob),
          preUpdatePatient.potraitUrl,
          notes,
          preUpdatePatient.userId
        );
        this._patients.next(updatedPatients);
      })
    );
  }

  deletePatient() {

  }

}
