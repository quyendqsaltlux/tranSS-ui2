import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../gaurd/AuthGuard';
import {RoleGuard} from '../gaurd/RoleGuard';
import {MigrateDataComponent} from './migrate-data/migrate-data.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      title: 'Project Management',
      roles: ['ROLE_ADMIN']
    },
    children: [
      {path: '', redirectTo: 'migrate', pathMatch: 'full'},
      {path: 'migrate', component: MigrateDataComponent, data: {title: 'Import data'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
