import { Injectable } from '@angular/core';

import { Patient } from './patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  private patientList: Patient[] = [
    new Patient(1,
      'John',
      'Doe',
      '1980-05-15',
      'Male',
      'https://www.eharmony.com/blog/wp-content/uploads/2010/04/eHarmony-Blog-profile-picture.jpg'
    ),
    new Patient(
      2,
      'Jane',
      'Doe',
      '1982-02-30',
      'Female',
      'https://content-static.upwork.com/uploads/2014/10/01073427/profilephoto1.jpg'
    ),
    new Patient(
      3,
      'Joe',
      'Bloggs',
      '1995-12-04',
      'Male',
      'http://goldenayeyarwaddytravels.com/sites/default/files/default_images/default-user-icon-8.jpg'
    ),
    new Patient(
      4,
      'Jess',
      'Briggs',
      '1990-08-31',
      'Female',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSodylrg6Lyn15aQMFE9K8ZOGwQ1ZDbBBUJu6DAwO4Xmg1_B53B'
    ),
  ];

  constructor() { }

  get patients() {
    return [...this.patientList];
  }

  getPatient(id: number) {
    return { ...this.patientList.find(patient => patient.id === id) };
  }
}
