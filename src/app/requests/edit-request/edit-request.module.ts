import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditRequestPage } from './edit-request.page';
import { PatientConsultantSelectorSharedModule } from 'src/app/shared/patient-consultant-selector.module';

const routes: Routes = [
  {
    path: '',
    component: EditRequestPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    PatientConsultantSelectorSharedModule
  ],
  declarations: [EditRequestPage]
})
export class EditRequestPageModule {}
