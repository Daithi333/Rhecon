import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private router: Router,
              private modalController: ModalController) {
  }

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
      component: SignupComponent,
      id: 'signup'
    }).then(modalEl => {
      modalEl.present();
    });
  }
}
