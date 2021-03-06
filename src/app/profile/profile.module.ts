import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { PortraitImageSharedModule } from '../shared-portrait/shared-portrait.module';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
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
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
