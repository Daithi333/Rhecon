import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: '../home/home.module#HomePageModule'
          }
        ]
      },
      {
        path: 'patients',
        children: [
          {
            path: '',
            loadChildren: '../patients/patients.module#PatientsPageModule'
          },
          {
            path: 'new-patient',
            loadChildren: '../patients/new-patient/new-patient.module#NewPatientPageModule'
          },
          {
            path: 'edit-patient/:patientId',
            loadChildren: '../patients/edit-patient/edit-patient.module#EditPatientPageModule'
          },
          {
            path: ':patientId',
            loadChildren: '../patients/view-patient/view-patient.module#ViewPatientPageModule'
          }

        ]
      },
      {
        path: 'consultants',
        children: [
          {
            path: '',
            loadChildren: '../consultants/consultants.module#ConsultantsPageModule'
          },
          {
            path: ':consultantId',
            loadChildren: '../consultants/view-consultant/view-consultant.module#ViewConsultantPageModule'
          }
        ]
      },
      {
        path: 'requests',
        children: [
          {
            path: '',
            loadChildren: '../requests/requests.module#RequestsPageModule'
          },
          {
            path: 'new-request',
            loadChildren: '../requests/new-request/new-request.module#NewRequestPageModule'
          },
          {
            path: 'closed-requests',
            loadChildren: '../requests/closed-requests/closed-requests.module#ClosedRequestsPageModule'
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: '../settings/settings.module#SettingsPageModule'
          }
        ]
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsRoutingModule {}