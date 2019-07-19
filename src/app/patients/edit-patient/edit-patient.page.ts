import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, iif, defer } from 'rxjs';

import { PatientsService } from '../patients.service';
import { Patient } from '../patient.model';
import { switchMap } from 'rxjs/operators';
import { ImageUtilService } from 'src/app/shared-portrait/image-util-service';

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
  imageChanged = false;
  private patientSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private patientsService: PatientsService,
    private loadingController: LoadingController,
    private router: Router,
    private imageUtilService: ImageUtilService
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
            patientImage: new FormControl(null)
          });
          this.isLoading = false;
        });
    });
  }

  onImageChosen(imageData: string | File) {
    this.imageChanged = true;
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

  onUpdatePatient() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Updating Patient'
    }).then(loadingEl => {
      loadingEl.present();
      iif (
        () => !this.imageChanged,
        defer(() => this.callUpdatePatient(this.patient.portraitUrl)),
        defer(() => this.patientsService.addImage(this.form.get('patientImage').value).pipe(
          switchMap(resData => {
            // TODO - handle error from the add image function - server, size, etc
            return this.callUpdatePatient(resData.fileUrl);
          })
        ))
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

  // call UpdatePatient method with appropiate image url
  private callUpdatePatient(patientImage: string) {
    return this.patientsService.updatePatient(
      this.patient.id,
      this.form.value.firstName,
      this.form.value.lastName,
      new Date(this.form.value.dob),
      patientImage,
      this.form.value.notes
    );
  }

}
