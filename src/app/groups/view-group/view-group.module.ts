import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { ViewGroupPage } from './view-group.page';
import { EmailInvitationComponent } from './email-invitation/email-invitation.component';
import { GroupSearchComponent } from '../group-search/group-search.component';

const routes: Routes = [
  {
    path: '',
    component: ViewGroupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewGroupPage, EmailInvitationComponent],
  entryComponents: [EmailInvitationComponent]
})
export class ViewGroupPageModule {}
