import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {}

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'login');
  }

  onForgotPassword() {
    this.modalController.create({
      component: ForgotPasswordComponent,
      id: 'forgot-password'
    }).then(modalEl => {
      modalEl.present();
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.loadingController
      .create({keyboardClose: true, message: 'Logging in...'})
      .then(loadingEl => {
        loadingEl.present();
        this.authService.login(email, password)
          .subscribe(resData => {
            loadingEl.dismiss();
            this.onClose();
            this.router.navigateByUrl('/tabs/home');
          }, error => {
            console.log(error);
            loadingEl.dismiss();
            this.alertController.create({
              header: 'Login Unsuccessful',
              message: 'Email or password not recognised',
              buttons: ['Okay']
            }).then(loadingEl2 => {
              loadingEl2.present();
            });
          });
      });
  }

}
