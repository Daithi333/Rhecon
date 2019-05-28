import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';

import { RequestsService } from '../requests.service';
import { SelectPatientComponent } from '../select-patient/select-patient.component';
import { SelectConsultantComponent } from '../select-consultant/select-consultant.component';
import { Patient } from '../../patients/patient.model';
import { Consultant } from '../../consultants/consultant.model';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.page.html',
  styleUrls: ['./new-request.page.scss'],
})
export class NewRequestPage implements OnInit {
  requestForm: FormGroup;
  isLoading = false;
  selectedPatient: Patient;
  selectedConsultant: Consultant;

  constructor(
    private requestsService: RequestsService,
    private loadingController: LoadingController,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.requestForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
      }),
      patient: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      consultant: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      notes: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
      }),
    });
  }

  onAddRequest() {
    if (!this.requestForm.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Creating Request'
    }).then(loadingEl => {
      loadingEl.present();
      this.requestsService.addRequest(
        this.requestForm.value.title,
        this.requestForm.value.patient.id,
        this.requestForm.value.consultant.id,
        this.requestForm.value.notes
      ).subscribe(() => {
        this.loadingController.dismiss();
        this.requestForm.reset();
        this.router.navigate(['/tabs/requests']);
      });
    });
  }

  onPatientSelect() {
    this.modalController.create({
      component: SelectPatientComponent,
      id: 'patientSelect'
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(returnedData => {
      // console.log(returnedData);
      this.selectedPatient = returnedData.data;
      if (returnedData.data != null) {
        this.requestForm.patchValue(
          {
            patient : this.selectedPatient.firstName
            + ' ' +
            this.selectedPatient.lastName
          }
        );
      }
    });
  }

  onConsultantSelect() {
    this.modalController.create({
      component: SelectConsultantComponent,
      id: 'consultantSelect'
    })
    .then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(returnedData => {
      this.selectedConsultant = returnedData.data;
      if (returnedData.data != null) {
        this.requestForm.patchValue(
          {
            consultant : this.selectedConsultant.title + ' ' +
            this.selectedConsultant.firstName + ' ' +
            this.selectedConsultant.lastName
          }
        );
      }
    });
  }

}
