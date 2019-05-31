import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PODefault} from '../../model/PODefaullt';
import {InvoicesService} from '../../service/invoices.service';
import {InvoiceReq} from '../../model/invoiceReq';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {
  @ViewChild('downloadLink') private downloadLink: ElementRef;
  candidateCode: string = null;
  invoiceId: number = null;
  defaultInvoice;
  model: any = {};
  isShowForm = false;
  company;

  constructor(private route: ActivatedRoute,
              private toastr: ToastrService,
              private  invoiceService: InvoicesService) {
  }

  ngOnInit() {
    this.isShowForm = false;
    this.candidateCode = this.route.snapshot.paramMap.get('candidateCode');
    this.invoiceId = +this.route.snapshot.paramMap.get('invoiceId') || null;
    if (isNaN(this.invoiceId)) {
      this.invoiceId = null;
    }
    if (!this.invoiceId || this.invoiceId === 0) {
      this.getDefaultPo();
    } else {
      this.getModel();
    }
  }

  getModel() {
    this.invoiceService.findById(this.invoiceId).subscribe((resp) => {
      this.model = resp.body as PODefault;
      this.isShowForm = true;
    });
  }

  getDefaultPo() {
    this.invoiceService.getDefaultInvoice(this.candidateCode).subscribe((resp) => {
      this.defaultInvoice = resp.body;
      this.model = this.extractModel(this.defaultInvoice);
    }, () => {
      this.toastr.error('Fail to get default purchase order data');
    });
  }

  extractModel(defaultMode): InvoiceReq {
    const model = {} as InvoiceReq;
    model.purchaseOrders = defaultMode.purchaseOrders;
    if (defaultMode.candidate) {
      model.resourceName = defaultMode.resourceName;
      model.address = defaultMode.candidate.address;
      if (defaultMode.candidate.payment) {
        model.bankName = defaultMode.candidate.payment.bankName;
        model.account = defaultMode.candidate.payment.account;
        model.depositor = defaultMode.candidate.payment.accountOwner;
        model.swiftCode = defaultMode.candidate.payment.swiftCode;
        model.payPal = defaultMode.candidate.payment.payPal;
      }
    }

    return model;
  }

  onSubmit() {
    const param = this.buildParam(this.model);
    this.invoiceService.create(param, this.candidateCode).subscribe((resp => {
      this.model.id = resp.body.id;
      this.model.code = resp.body.code;
      this.toastr.success('Save successfully!');
    }), (error2 => {
      this.toastr.error('Fail to save!');
    }));
  }

  buildParam(model): InvoiceReq {
    const poParam = {...model} as InvoiceReq;
    poParam.purchaseOrders = model.purchaseOrders.map((po) => po.id);
    return poParam;
  }

  download() {
    this.invoiceService.downloadPO(this.model.id).subscribe((resp) => {
      const url = URL.createObjectURL(resp);
      const link = this.downloadLink.nativeElement;
      link.href = url;
      link.download = this.getPOName(this.model);
      link.click();
    });
  }

  getPOName(po: PODefault): string {
    return po.code + '.xlsx';
  }

  getSummaryTotal() {
    if (!this.model.purchaseOrders) {
      return 0;
    }
    let total = 0;
    this.model.purchaseOrders.forEach((po) => {
      total += Number(po.total);
    });
    return total;
  }
}
