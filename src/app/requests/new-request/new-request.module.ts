import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewRequestPage } from './new-request.page';
import { RequestsSharedModule } from '../../shared/shared-requests.module';

const routes: Routes = [
  {
    path: '',
    component: NewRequestPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    RequestsSharedModule
  ],
  declarations: [NewRequestPage]
})
export class NewRequestPageModule {}
