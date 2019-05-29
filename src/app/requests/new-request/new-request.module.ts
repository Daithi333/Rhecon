import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewRequestPage } from './new-request.page';
import { PatientConsultantSelectorSharedModule } from 'src/app/shared/patient-consultant-selector.module';

const routes: Routes = [
  {
    path: '',
    component: NewRequestPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    PatientConsultantSelectorSharedModule
  ],
  declarations: [NewRequestPage]
})
export class NewRequestPageModule {}
