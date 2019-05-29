import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../gaurd/AuthGuard';
import {RoleGuard} from '../gaurd/RoleGuard';
import {InvoicesComponent} from './invoices/invoices.component';
import {InvoiceFormComponent} from './invoice-form/invoice-form.component';

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
      {path: 'list', component: InvoicesComponent, data: {title: 'List'}},
      {path: ':candidateId/form/:invoiceId', component: InvoiceFormComponent, data: {title: 'Invoice form'}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule {
}
