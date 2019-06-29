import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { EditProfilePage } from './edit-profile.page';
import { PortraitImageSharedModule } from '../../shared-portrait/shared-portrait.module';

const routes: Routes = [
  {
    path: '',
    component: EditProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PortraitImageSharedModule
  ],
  declarations: [EditProfilePage]
})
export class EditProfilePageModule {}
