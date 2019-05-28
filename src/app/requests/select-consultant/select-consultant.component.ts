import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-consultant',
  templateUrl: './select-consultant.component.html',
  styleUrls: ['./select-consultant.component.scss'],
})
export class SelectConsultantComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'consultantSelect');
  }

}
