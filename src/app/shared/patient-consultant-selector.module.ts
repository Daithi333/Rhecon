import { NgModule } from '@angular/core';

import { SelectPatientComponent } from './select-patient/select-patient.component';
import { SelectConsultantComponent } from './select-consultant/select-consultant.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ],
  declarations: [
    SelectConsultantComponent,
    SelectPatientComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SelectConsultantComponent,
    SelectPatientComponent,
  ],
  entryComponents: [
    SelectConsultantComponent,
    SelectPatientComponent
  ]
})
export class PatientConsultantSelectorSharedModule {}
