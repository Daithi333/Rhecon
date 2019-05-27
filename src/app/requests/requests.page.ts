import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

import { Request } from './request.model';
import { RequestsService } from './requests.service';
import { PatientsService } from '../patients/patients.service';
import { Patient } from '../patients/patient.model';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit, OnDestroy {
  activeRequests: Request[];
  inactiveRequests: Request[];
  patients: Patient[];
  private patientsSub: Subscription;

  constructor(
    private requestsService: RequestsService,
    private patientsService: PatientsService
  ) { }

  ngOnInit() {
    this.activeRequests = this.requestsService.activeRequests;
    this.inactiveRequests = this.requestsService.inactiveRequests;
    this.patientsSub = this.patientsService.patients.subscribe(patients => {
      this.patients = patients;
    });
  }

  onSegmentToggle(event: CustomEvent<SegmentChangeEventDetail>) {
    console.log('event.detail');
  }

  ngOnDestroy() {
    if (this.patientsSub) {
      this.patientsSub.unsubscribe();
    }
  }

  getPatient(id: number) {
    return  { ...this.patients.find(p => p.id === id) };
  }
}
