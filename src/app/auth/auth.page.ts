import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';

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
      component: LoginComponent
    }).then(modalEl => {
      modalEl.present();
    });
  }

  onSignup() {
    console.log('');
  }
}
