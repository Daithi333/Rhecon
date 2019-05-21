import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
              private modalController: ModalController,
              private router: Router) {
  }

  ngOnInit() {}

  onClose() {
    this.modalController.dismiss(null, 'cancel', 'login');
  }

  onLogin() {
    this.authService.login();
    this.modalController.dismiss(null, 'cancel');
    this.router.navigateByUrl('/tabs/home');
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);
  }

}
