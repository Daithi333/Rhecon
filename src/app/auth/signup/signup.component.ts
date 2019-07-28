import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { HttpService, TitleData } from '../../shared-http/http.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
  titles: TitleData[] = [];
  form: FormGroup;
  isLoading = false;
  @Input() chosenRole;
  @Input() chosenSpecialism;
  titlesSub: Subscription;

  constructor(
    private modalController: ModalController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.titlesSub = this.httpService.fetchTitles()
    .subscribe(titleData => {
      this.titles = titleData;
      this.isLoading = false;
    });
    this.form = new FormGroup({
      firstName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
      }),
      lastName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.pattern(/^[a-zA-Z'. -]*$/)]
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
      titleId: new FormControl(null, {
        validators: [Validators.required]
      }),
      userTypeId: new FormControl(this.chosenRole, {
        validators: [Validators.required]
      }),
      specialismId: new FormControl(this.chosenSpecialism, {
        validators: [Validators.required]
      })
    });
  }

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'signup');
  }

  // call the Signup method with the form data
  onSignup() {
    if (!this.form.valid) {
      return;
    }
    this.isLoading = true;
    this.loadingController
      .create({keyboardClose: true, message: 'Signing up...'})
      .then(loadingEl => {
        loadingEl.present();
        this.authService.signup(
          this.form.value.titleId,
          this.form.value.firstName,
          this.form.value.lastName,
          this.form.value.userTypeId,
          this.form.value.specialismId,
          this.form.value.email,
          this.form.value.password
        ).subscribe(resData => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.presentAlert();
          this.onClose();
        },
        error => {
          console.log(error);
          this.isLoading = false;
          loadingEl.dismiss();
          const errorMsg = this.determineError(error.error);
          this.alertController.create({
            header: 'Unsuccessful Signup',
            message: errorMsg,
            buttons: ['Okay']
          }).then(alertEl => {
            alertEl.present();
          });
        });
    });
  }

  ngOnDestroy() {
    if (this.titlesSub) {
      this.titlesSub.unsubscribe();
    }
  }

  private async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Success!',
      message: 'How have successfully signed up! Please proceed to login.',
      buttons: ['OK']
    });
    await alert.present();
  }

  // helper method to determine error message from backend API response
  private determineError(error: string) {
    switch (error) {
      case 'Email already registered':
        return 'Email already registered';
      case 'Invalid email':
        return 'Email format is invalid';
      case 'Invalid password':
        return 'Password complexity is insufficient';
      case 'Invalid firstname':
        return 'First name format is not supported';
      case 'Invalid lastname':
        return 'Last name format is not supported';
      default:
        return 'Something went wrong. Please try again later';
    }
  }

}
