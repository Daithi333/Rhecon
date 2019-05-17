import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClosedRequestsPage } from './closed-requests.page';

const routes: Routes = [
  {
    path: '',
    component: ClosedRequestsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClosedRequestsPage]
})
export class ClosedRequestsPageModule {}
