import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

import { PatientsService } from '../../patients/patients.service';
import { Patient } from '../../patients/patient.model';

@Component({
  selector: 'app-select-patient',
  templateUrl: './select-patient.component.html',
  styleUrls: ['./select-patient.component.scss'],
})
export class SelectPatientComponent implements OnInit, OnDestroy {
  patients: Patient[];
  private patientsSub: Subscription;

  constructor(
    private modalController: ModalController, private patientsService: PatientsService) { }

  ngOnInit() {
    this.patientsSub = this.patientsService.patients
      .subscribe(patients => {
        this.patients = patients;
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'patientSelect');
  }

  onPatientSelect() {
    this.modalController.dismiss(null, 'cancel', 'patientSelect');
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const patientId = form.value.selectedPatient;
    console.log(patientId);
  }

  ngOnDestroy() {
    if (this.patientsSub) {
      this.patientsSub.unsubscribe();
    }
  }

}
