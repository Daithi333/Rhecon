import { Component, OnInit, OnDestroy } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';
import { IonItemSliding, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { RequestsService } from './requests.service';
import { RequestWithPatientAndConsultant } from './request-patient-consultant.model';
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
  requestData: RequestWithPatientAndConsultant[] = [];
  viewableRequests: RequestWithPatientAndConsultant[] = [];
  isLoading = false;
  private requestSub: Subscription;
  private patientSub: Subscription;
  private consultantSub: Subscription;
  private currentSegment = 'active';

  constructor(
    private requestsService: RequestsService,
    private patientsService: PatientsService,
    private consultantsService: ConsultantsService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    // this.requestsService.fetchRequestsWithPatientAndConsultant().subscribe(req => {console.log(req); });
    let requests: Request[];
    this.requestSub = this.requestsService.fetchRequests()
      .subscribe(reqs => {
        requests = reqs;
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
                      new RequestWithPatientAndConsultant(
                        requests[key].id,
                        requests[key].title,
                        requests[key].requesterId,
                        patient,
                        consultant,
                        requests[key].notes,
                        !!+requests[key].active,
                        requests[key].createdOn,
                        requests[key].updatedOn
                      )
                    );
                    if (this.currentSegment === 'active') {
                      this.viewableRequests = this.requestData.filter(
                          rd => rd.active === true
                      );
                    } else {
                      this.viewableRequests = this.requestData.filter(
                        rd => rd.active === false
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
    this.requestsService.fetchRequests().subscribe(requests => {
      // TODO - rework so new request and edits are visible after redirect
      this.isLoading = false;
    });
  }

  onSegmentToggle(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'active') {
      this.currentSegment = 'active';
      this.viewableRequests = this.requestData.filter(
        rd => rd.active === true
      );
    } else {
      this.currentSegment = 'inactive';
      this.viewableRequests = this.requestData.filter(
        rd => rd.active === false
      );
    }
  }

  onEdit(requestId: number, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'tabs', 'requests', 'edit-request', requestId]);
    console.log('Editing request ', requestId);
  }

  onCloseRequest(requestId: number, slidingItem: IonItemSliding) {
    this.alertController.create({
      header: 'Confirm closure',
      message: 'Are you sure you wish to close this request?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.requestsService.closeRequest(requestId).subscribe(() => {
              slidingItem.close();
            });
          }
        },
        {
          text: 'No',
          handler: () => {
            slidingItem.close();
        }
      }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
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
