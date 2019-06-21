import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RoleSelectionComponent } from './role-selection/role-selection.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private modalController: ModalController) {}

  ngOnInit() {
  }

  onLogin() {
    this.modalController.create({
      component: LoginComponent,
      id: 'login'
    }).then(modalEl => {
      modalEl.present();
    });
  }

  onSignup() {
    this.modalController.create({
      component: RoleSelectionComponent,
      id: 'role-selection'
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(modalData => {
      console.log(modalData);
      if (modalData.role !== 'cancel') {
        this.modalController.create({
          component: SignupComponent,
          componentProps: {
            chosenRole: modalData.data.chosenRole,
            chosenSpecialism : modalData.data.chosenSpecialism
          },
          id: 'signup'
        }).then(modalEl => {
          modalEl.present();
        });
      }
    });
  }
}
