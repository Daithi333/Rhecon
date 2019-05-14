import { Component, OnInit } from '@angular/core';

import { PatientsService } from './patients.service';
import { Patient } from './patient.model';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
})
export class PatientsPage implements OnInit {
  patients: Patient[];

  constructor(private patientsService: PatientsService) { }

  ngOnInit() {
    this.patients = this.patientsService.patients;
  }

}
