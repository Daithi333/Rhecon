import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

import { PatientsService } from '../patients.service';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.page.html',
  styleUrls: ['./new-patient.page.scss'],
})
export class NewPatientPage implements OnInit {
  form: FormGroup;

  constructor(
    private patientsService: PatientsService,
    private loadingController: LoadingController,
    private router: Router
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
      patientImage: new FormControl(null, {
        updateOn: 'blur'
      })
    });
  }

  onImageChosen(imageData: string | File) {

  }

  onAddPatient() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Adding Patient'
    }).then(loadingEl => {
      loadingEl.present();
      this.patientsService.addPatient(
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

}
