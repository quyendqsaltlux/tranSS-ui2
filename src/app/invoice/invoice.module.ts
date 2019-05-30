import {NgModule} from '@angular/core';
import {InvoiceFormComponent} from './invoice-form/invoice-form.component';
import {InvoicesComponent} from './invoices/invoices.component';
import {ShareModule} from '../share/share.module';
import {InvoiceRoutingModule} from './invoice-routing.module';
import { AuditPosComponent } from './audit-pos/audit-pos.component';
import { InvoiceWrapperComponent } from './invoice-wrapper/invoice-wrapper.component';

@NgModule({
  declarations: [InvoiceFormComponent, InvoicesComponent, AuditPosComponent, InvoiceWrapperComponent],
  imports: [
    ShareModule,
    InvoiceRoutingModule
  ]
})
export class InvoiceModule {
}
