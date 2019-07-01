import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { AuthPage } from './auth.page';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { RoleSelectionComponent } from './role-selection/role-selection.component';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    component: AuthPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AuthPage, LoginComponent, SignupComponent, RoleSelectionComponent, ForgotPasswordComponent],
  entryComponents: [LoginComponent, SignupComponent, RoleSelectionComponent, ForgotPasswordComponent]
})
export class AuthPageModule {}
