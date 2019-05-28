import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditRequestPage } from './edit-request.page';
import { SelectConsultantComponent } from '../select-consultant/select-consultant.component';
import { SelectPatientComponent } from '../select-patient/select-patient.component';

const routes: Routes = [
  {
    path: '',
    component: EditRequestPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditRequestPage, SelectConsultantComponent, SelectPatientComponent],
  entryComponents: [SelectConsultantComponent, SelectPatientComponent]
})
export class EditRequestPageModule {}
