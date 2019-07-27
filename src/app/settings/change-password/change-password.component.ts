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
      this.presentAlert();
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
          this.presentAlert();
          this.onClose();
          this.authService.logout();
          this.router.navigate(['/auth']);
        },
        error => {
          console.log(error);
          loadingEl.dismiss();
          this.presentAlert();
        });
      });
  }

  private presentAlert() {
    this.alertController.create({
      header: 'Unsucessful',
      message: 'The email or password entered does not match your account.',
      buttons: ['Okay']
    }).then(alertEl => {
      this.form.patchValue({
        email: '',
        currentPassword: ''
      });
      alertEl.present();
    });
  }

}
