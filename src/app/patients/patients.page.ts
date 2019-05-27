import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PatientsService } from './patients.service';
import { Patient } from './patient.model';


@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
})
export class PatientsPage implements OnInit, OnDestroy {
  patients: Patient[];
  private patientsSub: Subscription;

  constructor(private patientsService: PatientsService) { }

  ngOnInit() {
    this.patientsSub = this.patientsService.patients
      .subscribe(patients => {
        this.patients = patients;
      });
  }

  ngOnDestroy() {
    if (this.patientsSub) {
      this.patientsSub.unsubscribe();
    }
  }

}
