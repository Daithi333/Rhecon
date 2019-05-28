import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-patient',
  templateUrl: './select-patient.component.html',
  styleUrls: ['./select-patient.component.scss'],
})
export class SelectPatientComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'patientSelect');
  }

}
