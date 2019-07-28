import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, iif, defer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { PatientsService } from '../patients.service';
import { Patient } from '../patient.model';
import { ImageUtilService } from '../../shared-portrait/image-util-service';

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
    private imageUtilService: ImageUtilService,
    private alertController: AlertController
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
        },
        error => {
          this.alertController.create({
            header: 'Error',
            message: 'Could not locate patient record.',
            buttons: [
              {
                text: 'Okay',
                handler: () => {
                  this.router.navigate(['/tabs/patients']);
                }
              }
            ]
          }).then(alertEl => {
            alertEl.present();
          });
        });
    });
  }

  /**
   * patch the image file into form. Convert to blob first if it is a string
   * @param imageData - the image file or dataUrl if from Camera API
   */
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

  /**
   * call updatePatient directly if image unchanged, or call addimage first
   */
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
            if (resData.message) {
              this.fileConversionAlert();
              return;
            }
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

  // helper method to call UpdatePatient with appropriate image url
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

  private fileConversionAlert() {
    this.alertController.create({
      header: 'File Error',
      message: 'Something went wrong with file. Please retry using .jpg format.',
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
