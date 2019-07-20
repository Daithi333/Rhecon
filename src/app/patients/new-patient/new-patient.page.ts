import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { iif, defer } from 'rxjs';

import { PatientsService } from '../patients.service';
import { ImageUtilService } from '../../shared-portrait/image-util-service';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.page.html',
  styleUrls: ['./new-patient.page.scss'],
})
export class NewPatientPage implements OnInit {
  form: FormGroup;
  imagePreview = '../../assets/icon/default-patient-icon.png';

  constructor(
    private patientsService: PatientsService,
    private loadingController: LoadingController,
    private router: Router,
    private imageUtilService: ImageUtilService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      firstName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
      }),
      lastName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
      }),
      dob: new FormControl(null, {
        updateOn: 'blur'
      }),
      notes: new FormControl(null, {
        updateOn: 'blur'
      }),
      patientImage: new FormControl(this.imagePreview)
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
        this.fileConversionAlert();
      }
    } else {
      imageFile = imageData;
    }
    this.form.patchValue({ patientImage: imageFile });
  }

  onAddPatient() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Adding Patient'
    }).then(loadingEl => {
      loadingEl.present();
      iif (
        () => this.form.value.patientImage === this.imagePreview,
        defer(() => this.callAddPatient(this.imagePreview)),
        defer(() => this.patientsService.addImage(this.form.get('patientImage').value).pipe(
          switchMap(resData => {
            // TODO - handle error from the add image function
            return this.callAddPatient(resData.fileUrl);
          })
        ))
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/tabs/patients']);
      });
    });
  }

  // call AddPatient method with appropiate image url
  private callAddPatient(patientImage: string) {
    return this.patientsService.addPatient(
      this.form.value.firstName,
      this.form.value.lastName,
      new Date(this.form.value.dob),
      patientImage,
      this.form.value.notes
    );
  }

  private fileConversionAlert() {
    this.alertController.create({
      header: 'Error',
      message: 'Something went wrong with file conversion. Please retry using .jpg format.',
      buttons: [
        {
          text: 'Okay',
        }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

}
