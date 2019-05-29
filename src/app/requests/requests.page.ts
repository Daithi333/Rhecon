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
  requests: Request[];
  viewableRequests: Request[];
  patients: Patient[];
  private patientsSub: Subscription;
  private requestSub: Subscription;
  private currentSegment = 'active';

  constructor(
    private requestsService: RequestsService,
    private patientsService: PatientsService
  ) { }

  ngOnInit() {
    this.requestSub = this.requestsService.requests
      .subscribe(requests => {
        this.requests = requests;

        if (this.currentSegment === 'active') {
          this.viewableRequests = this.requests.filter(
            request => request.requestActive === true
          );
        } else {
          this.viewableRequests = this.requests.filter(
            request => request.requestActive === false
          );
        }
      });
    this.patientsSub = this.patientsService.patients
      .subscribe(patients => {
        this.patients = patients;
      });
  }

  onSegmentToggle(event: CustomEvent<SegmentChangeEventDetail>) {
    // console.log('event.detail');
    if (event.detail.value === 'active') {
      this.currentSegment = 'active';
      this.viewableRequests = this.requests.filter(
        request => request.requestActive === true
      );
    } else {
      this.currentSegment = 'inactive';
      this.viewableRequests = this.requests.filter(
        request => request.requestActive === false
      );
    }

  }

  ngOnDestroy() {
    if (this.patientsSub) {
      this.patientsSub.unsubscribe();
    }
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
  }

  getPatient(id: number) {
    return { ...this.patients.find(p => p.id === id) };
  }
}
