import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ViewRequestPage } from './view-request.page';
import { AddCommentComponent } from './add-comment/add-comment.component';

const routes: Routes = [
  {
    path: '',
    component: ViewRequestPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewRequestPage, AddCommentComponent],
  entryComponents: [AddCommentComponent]
})
export class ViewRequestPageModule {}
