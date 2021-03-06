import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GroupsPage } from './groups.page';
import { JoinGroupComponent } from './join-group/join-group.component';
import { GroupSearchComponent } from './group-search/group-search.component';

const routes: Routes = [
  {
    path: '',
    component: GroupsPage
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
  declarations: [GroupsPage, JoinGroupComponent, GroupSearchComponent],
  entryComponents: [JoinGroupComponent, GroupSearchComponent]
})
export class GroupsPageModule {}
