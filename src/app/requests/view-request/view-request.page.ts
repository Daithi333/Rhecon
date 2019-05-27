import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { RequestsService } from '../requests.service';
import { Request } from '../request.model';
import { Patient } from '../../patients/patient.model';
import { PatientsService } from '../../patients/patients.service';
import { ConsultantsService } from '../../consultants/consultants.service';
import { Consultant } from '../../consultants/consultant.model';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.page.html',
  styleUrls: ['./view-request.page.scss'],
})
export class ViewRequestPage implements OnInit, OnDestroy {
  request: Request;
  patient: Patient;
  consultant: Consultant;
  private patientSub: Subscription;
  private consultantSub: Subscription;
  canEdit = true;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private requestsService: RequestsService,
    private patientsService: PatientsService,
    private usersService: ConsultantsService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('requestId')) {
        this.navController.navigateBack('/tabs/requests');
        return;
      }
      this.request = this.requestsService.getRequest(+paramMap.get('requestId'));
      if (this.request.requestActive === false) {
        this.canEdit = false;
      }
      this.patientSub = this.patientsService.getPatient(this.request.patientId)
        .subscribe(patient => {
          this.patient = patient;
        });
      this.consultantSub = this.usersService.getConsultant(this.request.consultantId)
        .subscribe(consultant => {
          this.consultant = consultant;
        });
    });
  }

  ngOnDestroy() {
    if (this.patientSub) {
      this.patientSub.unsubscribe();
    }
    if (this.consultantSub) {
      this.consultantSub.unsubscribe();
    }
  }

}
