import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PatientsService } from '../patients.service';
import { Patient } from '../patient.model';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.page.html',
  styleUrls: ['./edit-patient.page.scss'],
})
export class EditPatientPage implements OnInit {
  form: FormGroup;
  patient: Patient;

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
      this.patient = this.patientsService.getPatient(+paramMap.get('patientId'));
    });
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
  }

  onUpdatePatient() {
    console.log(this.form);
  }

}
