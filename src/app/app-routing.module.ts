import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'tabs/home', pathMatch: 'full' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule', canLoad: [AuthGuard] },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule', canLoad: [AuthGuard] },
  { path: 'groups', children: [
      {
        path: '',
        loadChildren: './groups/groups.module#GroupsPageModule', canLoad: [AuthGuard]
      },
      {
        path: ':groupId',
        loadChildren: './groups/view-group/view-group.module#ViewGroupPageModule', canLoad: [AuthGuard]
      }
  ] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
