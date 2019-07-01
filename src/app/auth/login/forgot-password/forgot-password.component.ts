import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl } from '@angular/forms';

import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null)
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'forgot-password');
  }

  onResetPassword() {
    if (!this.form.valid) {
      return;
    }
    this.loadingController.create({
      message: 'Sending email...'
    }).then(loadingEl => {
      loadingEl.present();
      this.authService.resetPasswordEmail(
        this.form.value.email
      ).subscribe(() => {
        loadingEl.dismiss();
        this.presentAlert();
        this.onClose();
      },
      error => {
        console.log(error);
        loadingEl.dismiss();
        this.alertController.create({
          header: 'Error',
          message: 'There was a problem sending the email, please try again later',
          buttons: ['Okay']
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  private async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Email Sent',
      message: `A Password reset link has been sent to ${this.form.value.email}.`,
      buttons: ['OK']
    });
    await alert.present();
  }

}
