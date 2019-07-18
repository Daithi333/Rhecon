import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  email: string;
  isLoading = false;

  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.authService.email.subscribe(email => {
      this.email = email;
      this.form = new FormGroup({
        email: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required, Validators.email]
        }),
        currentPassword: new FormControl(null, {
          updateOn: 'blur',
          validators: [
            Validators.required,
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/)
          ]
        }),
        newPassword: new FormControl(null, {
          updateOn: 'blur',
          validators: [
            Validators.required,
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/)
          ]
        }),
      });
      this.isLoading = false;
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'changePassword');
  }

  onChangePassword() {
    if (this.form.value.email !== this.email) {
      this.presentEmailAlert();
      return;
    }
    console.log('email ok');
    this.loadingController
      .create({keyboardClose: true, message: 'Updating password...'})
      .then(loadingEl => {
        loadingEl.present();
        this.authService.changePassword(
          this.form.value.email,
          this.form.value.currentPassword,
          this.form.value.newPassword
        ).subscribe(() => {
          loadingEl.dismiss();
          this.presentPasswordAlert();
          this.onClose();
          this.authService.logout();
          this.router.navigate(['/auth']);
        },
        error => {
          console.log(error);
          loadingEl.dismiss();
          let errorMsg = 'Could not update password, please try again shortly';
          if (error.error.message === 'Password incorrect') {
            errorMsg = 'Inocrrect password entered';
          }
          this.alertController.create({
            header: 'Unsuccessful',
            message: errorMsg,
            buttons: ['Okay']
          }).then(alertEl => {
            alertEl.present();
          });
        });
      });
  }

  private presentEmailAlert() {
    this.alertController.create({
      header: 'Invalid email address',
      message: 'The email address entered does not match your account.',
      buttons: ['Okay']
    }).then(alertEl => {
      this.form.patchValue({
        email: ''
      });
      alertEl.present();
    });
  }

  private presentPasswordAlert() {
    this.alertController.create({
      header: 'Success',
      message: 'Password sucessfully updated. Please login again',
      buttons: ['Okay']
    }).then(alertEl => {
      alertEl.present();
      this.authService.logout();
    });
  }

}
