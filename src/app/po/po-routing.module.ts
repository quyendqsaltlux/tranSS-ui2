import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../gaurd/AuthGuard';
import {RoleGuard} from '../gaurd/RoleGuard';
import {PoFormComponent} from './po-form/po-form.component';
import {PoListComponent} from './po-list/po-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      title: 'PO Management',
      roles: ['ROLE_ADMIN', 'ROLE_PM', 'ROLE_RM']
    },
    children: [
      {path: '', redirectTo: 'list', pathMatch: 'full'},
      {path: 'list', component: PoListComponent, data: {title: 'List'}},
      {path: ':assignmentId/form/:poId', component: PoFormComponent, data: {title: 'PO form'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoRoutingModule {
}
