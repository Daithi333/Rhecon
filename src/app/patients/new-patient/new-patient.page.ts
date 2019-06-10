import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { PatientsService } from '../patients.service';
import { switchMap } from 'rxjs/operators';
import { ImageUtilService } from 'src/app/shared-portrait/image-util-service';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.page.html',
  styleUrls: ['./new-patient.page.scss'],
})
export class NewPatientPage implements OnInit {
  form: FormGroup;
  imagePreview = 'http://dmcelhill01.lampt.eeecs.qub.ac.uk/php_rest_rhecon/img/default-user-icon.jpg';

  constructor(
    private patientsService: PatientsService,
    private loadingController: LoadingController,
    private router: Router,
    private imageUtilService: ImageUtilService
  ) {}

  ngOnInit() {
    // create reactive form group and controls
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
        // TODO - add alert if base 64 conversion to file fails
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
      this.patientsService.addImage(this.form.get('patientImage').value)
        .pipe(
          switchMap(resData => {
            // TODO - handle error from the add image function
            console.log(resData);
            return this.patientsService.addPatient(
              this.form.value.firstName,
              this.form.value.lastName,
              new Date(this.form.value.dob),
              resData.imageUrl,
              this.form.value.notes
            );
          })
        ).subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigate(['/tabs/patients']);
        });
    });
  }

}
