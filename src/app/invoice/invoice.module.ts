import {NgModule} from '@angular/core';
import {InvoiceFormComponent} from './invoice-form/invoice-form.component';
import {InvoicesComponent} from './invoices/invoices.component';
import {ShareModule} from '../share/share.module';
import {InvoiceRoutingModule} from './invoice-routing.module';

@NgModule({
  declarations: [InvoiceFormComponent, InvoicesComponent],
  imports: [
    ShareModule,
    InvoiceRoutingModule
  ]
})
export class InvoiceModule {
}
