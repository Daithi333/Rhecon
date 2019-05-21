import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  isLoading = false;

  constructor(private modalController: ModalController,
              private loadingController: LoadingController,
              private alertController: AlertController) {
  }

  ngOnInit() {
    // create reactive form group and controls
    this.form = new FormGroup({
      firstName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      lastName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null, {
        updateOn: 'blur',
        validators: [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!$%@#£€*?&]{8,}$/)
        ]
      }),
      country: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'signup');
  }

  onSignup() {
    if (!this.form.valid) {
      return;
    }
    console.log(this.form);
    this.isLoading = true;
    this.loadingController
      .create({keyboardClose: true, message: 'Signing up...'})
      .then(loadingEl => {
        loadingEl.present();
        setTimeout(() => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.presentAlert();
        }, 2000);
    });
    this.onClose();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Success!',
      message: 'How have successfully signed up! Please proceed to login.',
      buttons: ['OK']
    });
    await alert.present();
  }

}
