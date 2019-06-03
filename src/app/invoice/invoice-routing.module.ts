import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../gaurd/AuthGuard';
import {RoleGuard} from '../gaurd/RoleGuard';
import {InvoiceFormComponent} from './invoice-form/invoice-form.component';
import {InvoiceWrapperComponent} from './invoice-wrapper/invoice-wrapper.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      title: 'Invoice Management',
      roles: ['ROLE_ADMIN', 'ROLE_PM', 'ROLE_RM']
    },
    children: [
      {path: '', redirectTo: 'list', pathMatch: 'full'},
      {path: 'list', component: InvoiceWrapperComponent, data: {title: 'List'}},
      {path: ':candidateCode/:externalResourceName/:company/form/:invoiceId', component: InvoiceFormComponent, data: {title: 'Invoice form'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule {
}
