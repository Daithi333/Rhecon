import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';

import { RequestsService } from '../requests.service';
import { SelectPatientComponent } from '../../shared/select-patient/select-patient.component';
import { SelectConsultantComponent } from '../../shared/select-consultant/select-consultant.component';
import { Patient } from '../../patients/patient.model';
import { Consultant } from '../../consultants/consultant.model';
import { ImageUtilService } from '../../shared-portrait/image-util-service';

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
    private modalController: ModalController,
    private imageUtilService: ImageUtilService
  ) {}

  ngOnInit() {
    this.requestForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, /*Validators.pattern(/^[a-zA-Z'. -]*$/)*/]
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
        validators: [Validators.required]
      }),
      image: new FormControl(null)
    });
  }

  onImageChosen(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = this.imageUtilService.base64toBlob(
          imageData.replace('data:image/jpeg;base64,', ''),
          'image/jpeg'
        );
      } catch (error) {
        console.log('File conversion error: ' + error);
        // TODO - add alert if conversion to file fails
      }
    } else {
      imageFile = imageData;
    }
    this.requestForm.patchValue({ image: imageFile });
  }

  onAttachmentsChosen(filesData: string[] | File[]) {
    console.log(filesData);
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

  onAddRequest() {
    if (!this.requestForm.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Creating Request'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.requestsService.addRequest(
        this.requestForm.value.title,
        this.selectedPatient.id,
        this.selectedConsultant.id,
        this.requestForm.value.notes
      )
      .subscribe(() => {
        this.loadingController.dismiss();
        this.requestForm.reset();
        this.router.navigate(['/tabs/requests']);
      });
    });
  }

}
