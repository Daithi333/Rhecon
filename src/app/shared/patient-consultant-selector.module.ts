import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SelectPatientComponent } from './select-patient/select-patient.component';
import { SelectConsultantComponent } from './select-consultant/select-consultant.component';
import { AttachmentSelectorComponent } from './attachment-selector/attachment-selector.component';

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
    AttachmentSelectorComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SelectConsultantComponent,
    SelectPatientComponent,
    AttachmentSelectorComponent
  ],
  entryComponents: [
    SelectConsultantComponent,
    SelectPatientComponent
  ]
})
export class PatientConsultantSelectorSharedModule {}
