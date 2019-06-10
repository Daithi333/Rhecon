import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonItemSliding, AlertController } from '@ionic/angular';
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
    private router: Router,
    private alertController: AlertController
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

  onRemove(patientId: number, slidingItem: IonItemSliding) {
    this.alertController.create({
      header: 'Confirm closure',
      message: 'Are you sure you wish to close this patient record?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.patientsService.removePatient(patientId).subscribe(() => {
              slidingItem.close();
            });
          }
        },
        {
          text: 'No',
          handler: () => {
            slidingItem.close();
        }
      }
      ]
    }).then(alertEl => {
      alertEl.present();
    });
  }

  ngOnDestroy() {
    if (this.patientsSub) {
      this.patientsSub.unsubscribe();
    }
  }

}
