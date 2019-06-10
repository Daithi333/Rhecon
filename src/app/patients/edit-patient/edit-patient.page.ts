import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { PatientsService } from '../patients.service';
import { Patient } from '../patient.model';

// utility function to convert base 64 string to blob
// https://www.udemy.com/ionic-2-the-practical-guide-to-building-ios-android-apps/learn/lecture/13728230#questions/6603702
function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.page.html',
  styleUrls: ['./edit-patient.page.scss'],
})
export class EditPatientPage implements OnInit, OnDestroy {
  form: FormGroup;
  patient: Patient;
  patientId: number;
  isLoading = false;
  private patientSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private patientsService: PatientsService,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('patientId')) {
        this.navController.navigateBack('/tabs/patients');
        return;
      }
      this.patientId = +paramMap.get('patientId');
      this.isLoading = true;
      // retrieve patient id from URL (route paramMap) and use to initialise form with patient data
      this.patientSub = this.patientsService.getPatient(+paramMap.get('patientId'))
        .subscribe(patient => {
          this.patient = patient;
          this.form = new FormGroup({
            firstName: new FormControl(this.patient.firstName, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
            }),
            lastName: new FormControl(this.patient.lastName, {
              updateOn: 'blur',
              validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
            }),
            dob: new FormControl(this.patient.dob.toISOString(), {
              updateOn: 'blur'
            }),
            notes: new FormControl(this.patient.notes, {
              updateOn: 'blur'
            }),
            patientImage: new FormControl(this.patient.portraitUrl, {
              updateOn: 'blur'
            })
          });
          this.isLoading = false;
        });
    });
  }

  onImageChosen(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
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

  onUpdatePatient() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Updating Patient'
    }).then(loadingEl => {
      loadingEl.present();
      this.patientsService.updatePatient(
        this.patient.id,
        this.form.value.firstName,
        this.form.value.lastName,
        new Date(this.form.value.dob),
        this.form.value.notes
      ).subscribe(() => {
        loadingEl.dismiss();
        this.form.reset();
        this.router.navigate(['/tabs/patients']);
      });
    });
  }

  ngOnDestroy() {
    if (this.patientSub) {
      this.patientSub.unsubscribe();
    }
  }

}
