import {Component, OnInit} from '@angular/core';
import {InvoicesService} from '../../service/invoices.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  constructor(private invoiceService: InvoicesService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
  }

  generateInvoices() {
    this.invoiceService.generateInvoices().subscribe((resp) => {
      this.toastr.success('Generate invoices successfully!');
    }, error2 => this.toastr.error('Fail to generate!'));
  }

  onClickGenerateInvoice() {
    this.generateInvoices();
  }
}
