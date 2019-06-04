import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

import { RequestsService } from './requests.service';
import { RequestData } from './request-data.model';
import { Request } from './request.model';
import { Patient } from '../patients/patient.model';
import { Consultant } from '../consultants/consultant.model';
import { PatientsService } from '../patients/patients.service';
import { ConsultantsService } from '../consultants/consultants.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage implements OnInit, OnDestroy {
  requestData: RequestData[] = [];
  viewableRequests: RequestData[] = [];
  isLoading = false;
  private requestSub: Subscription;
  private patientSub: Subscription;
  private consultantSub: Subscription;
  private currentSegment = 'active';

  constructor(
    private requestsService: RequestsService,
    private patientsService: PatientsService,
    private consultantsService: ConsultantsService
  ) { }

  ngOnInit() {
    let requests: Request[];
    this.requestSub = this.requestsService.requests
      .subscribe(reqs => {
        requests = reqs;
        console.log(reqs);
        for (const key in requests) {
          if (requests.hasOwnProperty(key)) {
            let patient: Patient;
            let consultant: Consultant;
            this.patientSub = this.patientsService.getPatient(requests[key].patientId)
              .subscribe(pat => {
                patient = pat;
                this.consultantSub = this.consultantsService.getConsultant(requests[key].consultantId)
                  .subscribe(cons => {
                    consultant = cons;
                    this.requestData.push(
                      new RequestData(
                        requests[key].id,
                        requests[key].title,
                        requests[key].requesterId,
                        patient,
                        consultant,
                        requests[key].notes,
                        requests[key].requestActive,
                        requests[key].createdOn,
                        requests[key].lastUpdated
                      )
                    );
                    if (this.currentSegment === 'active') {
                      this.viewableRequests = this.requestData.filter(
                          rd => rd.requestActive === true
                      );
                    } else {
                      this.viewableRequests = this.requestData.filter(
                        rd => rd.requestActive === false
                      );
                    }
                  });
              });
          }
        }
      });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.requestsService.fetchRequests().subscribe(() => {
      this.isLoading = false;
    });
  }

  onSegmentToggle(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'active') {
      this.currentSegment = 'active';
      this.viewableRequests = this.requestData.filter(
        rd => rd.requestActive === true
      );
    } else {
      this.currentSegment = 'inactive';
      this.viewableRequests = this.requestData.filter(
        rd => rd.requestActive === false
      );
    }
  }

  ngOnDestroy() {
    if (this.requestSub) {
      this.requestSub.unsubscribe();
    }
    if (this.patientSub) {
      this.patientSub.unsubscribe();
    }
    if (this.consultantSub) {
      this.consultantSub.unsubscribe();
    }
  }

}
