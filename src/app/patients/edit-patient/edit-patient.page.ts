import { Component, OnInit } from '@angular/core';
import { Patient } from '../patient.model';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PatientsService } from '../patients.service';

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.page.html',
  styleUrls: ['./edit-patient.page.scss'],
})
export class EditPatientPage implements OnInit {
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
  }

}
