import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { NewRequestPage } from './new-request.page';
import { SelectConsultantComponent } from '../select-consultant/select-consultant.component';
import { SelectPatientComponent } from '../select-patient/select-patient.component';

const routes: Routes = [
  {
    path: '',
    component: NewRequestPage
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
  declarations: [NewRequestPage, SelectConsultantComponent, SelectPatientComponent],
  entryComponents: [SelectConsultantComponent, SelectPatientComponent]
})
export class NewRequestPageModule {}
