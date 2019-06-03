import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PatientsService } from '../../patients/patients.service';
import { Patient } from '../../patients/patient.model';

@Component({
  selector: 'app-select-patient',
  templateUrl: './select-patient.component.html',
  styleUrls: ['./select-patient.component.scss'],
})
export class SelectPatientComponent implements OnInit, OnDestroy {
  patients: Patient[];
  isLoading = false;
  private patientsSub: Subscription;

  constructor(
    private modalController: ModalController, private patientsService: PatientsService) { }

  ngOnInit() {
    this.patientsSub = this.patientsService.patients
      .subscribe(patients => {
        this.patients = patients;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.patientsService.fetchPatients().subscribe(() => {
      this.isLoading = false;
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'patientSelect');
  }

  onPatientSelect(selectedPatient: Patient) {
    this.modalController.dismiss(selectedPatient, 'cancel', 'patientSelect');
    console.log(selectedPatient);
  }

  ngOnDestroy() {
    if (this.patientsSub) {
      this.patientsSub.unsubscribe();
    }
  }

}
