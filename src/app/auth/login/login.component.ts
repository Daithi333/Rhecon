import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isLoading = false;

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

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    this.loadingController
      .create({keyboardClose: true, message: 'Logging in...'})
      .then(loadingEl => {
        loadingEl.present();
        this.authService.login(email, password)
          .subscribe(resData => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.onClose();
            this.router.navigateByUrl('/tabs/home');
          }, error => {
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
