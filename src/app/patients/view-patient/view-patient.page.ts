import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { Patient } from '../patient.model';
import { PatientsService } from '../patients.service';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.page.html',
  styleUrls: ['./view-patient.page.scss'],
})
export class ViewPatientPage implements OnInit, OnDestroy{
  patient: Patient;
  patientId: number;
  isLoading = false;
  private patientSub: Subscription;

  constructor(
    private patientsService: PatientsService,
    private route: ActivatedRoute,
    private navController: NavController,
    private alertController: AlertController,
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
      this.patientSub = this.patientsService.getPatient(+paramMap.get('patientId'))
        .subscribe(patient => {
          this.patient = patient;
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

  ngOnDestroy() {
    if (this.patientSub) {
      this.patientSub.unsubscribe();
    }
  }

}