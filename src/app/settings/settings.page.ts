import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ChangePasswordComponent } from './change-password/change-password.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  onChangePassword() {
    this.modalController.create({
      component: ChangePasswordComponent,
      id: 'changePassword'
    })
    .then(modalEl => {
      modalEl.present();
    });
  }

}
