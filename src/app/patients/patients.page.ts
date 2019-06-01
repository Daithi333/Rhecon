import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

import { PatientsService } from './patients.service';
import { Patient } from './patient.model';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
})
export class PatientsPage implements OnInit, OnDestroy {
  patients: Patient[];
  isLoading = false;
  private patientsSub: Subscription;

  constructor(
    private patientsService: PatientsService,
    private router: Router
  ) {}

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

  onEdit(patientId: number, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'tabs', 'patients', 'edit-patient', patientId]);
    console.log('Editing item', patientId);
  }

  ngOnDestroy() {
    if (this.patientsSub) {
      this.patientsSub.unsubscribe();
    }
  }

}
