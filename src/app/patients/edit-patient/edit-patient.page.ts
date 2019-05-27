import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { PatientsService } from '../patients.service';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.page.html',
  styleUrls: ['./edit-patient.page.scss'],
})
export class EditPatientPage implements OnInit, OnDestroy {
  form: FormGroup;
  patient: Patient;
  private patientSub: Subscription;

  constructor(private route: ActivatedRoute,
              private navController: NavController,
              private patientsService: PatientsService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('patientId')) {
        this.navController.navigateBack('/tabs/patients');
        return;
      }
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
            dob: new FormControl(this.patient.dob, {
              updateOn: 'blur'
            }),
            notes: new FormControl(this.patient.notes, {
              updateOn: 'blur'
            }),
            patientImage: new FormControl(this.patient.potraitUrl, {
              updateOn: 'blur'
            })
          });
        });
    });
  }

  onUpdatePatient() {
    console.log(this.form);
  }

  ngOnDestroy() {
    if (this.patientSub) {
      this.patientSub.unsubscribe();
    }
  }

}
