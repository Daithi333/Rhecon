import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditRequestPage } from './edit-request.page';
import { RequestsSharedModule } from 'src/app/shared/shared-requests.module';

const routes: Routes = [
  {
    path: '',
    component: EditRequestPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    RequestsSharedModule
  ],
  declarations: [EditRequestPage]
})
export class EditRequestPageModule {}
