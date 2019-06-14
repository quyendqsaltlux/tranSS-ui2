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
  externalResourceName: string = null;
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
    this.extractUrl();
    if (isNaN(this.invoiceId)) {
      this.invoiceId = null;
    }
    if (!this.invoiceId || this.invoiceId === 0) {
      this.getDefaultPo();
    } else {
      this.getModel();
    }
  }

  extractUrl() {
    this.candidateCode = this.route.snapshot.paramMap.get('candidateCode');
    this.candidateCode = this.candidateCode === 'null' ? null : this.candidateCode;
    this.company = this.route.snapshot.paramMap.get('company');
    this.externalResourceName = this.route.snapshot.paramMap.get('externalResourceName');
    this.externalResourceName = this.externalResourceName === 'null' ? null : this.externalResourceName;
    this.invoiceId = +this.route.snapshot.paramMap.get('invoiceId') || null;
  }

  getModel() {
    this.invoiceService.findById(this.invoiceId).subscribe((resp) => {
      this.model = resp.body as PODefault;
      this.isShowForm = true;
    });
  }

  getDefaultPo() {
    this.invoiceService.getDefaultInvoice(this.company, this.candidateCode, this.externalResourceName)
      .subscribe((resp) => {
        this.defaultInvoice = resp.body;
        this.model = this.extractModel(this.defaultInvoice);
        console.log(this.model);
        this.isShowForm = true;
      }, () => {
        this.toastr.error('Fail to get default purchase order data');
      });
  }

  extractModel(defaultMode): InvoiceReq {
    const model = {} as InvoiceReq;
    model.purchaseOrders = defaultMode.purchaseOrders;
    model.total = defaultMode.total;
    model.currency = defaultMode.currency;
    if (defaultMode.candidate) {
      model.resourceName = defaultMode.resourceName;
      model.address = defaultMode.candidate.address;
      model.mobile = defaultMode.candidate.mobile;
      model.email = defaultMode.candidate.email;
      if (defaultMode.candidate.payment) {
        model.bankName = defaultMode.candidate.payment.bankName;
        model.account = defaultMode.candidate.payment.account;
        model.depositor = defaultMode.candidate.payment.accountOwner;
        model.swiftCode = defaultMode.candidate.payment.swiftCode;
        model.payPal = defaultMode.candidate.payment.payPal;
      }
    }
    if (this.externalResourceName) {
      model.resourceName = this.externalResourceName;
    }

    return model;
  }

  onSubmit() {
    const param = this.buildParam(this.model);
    this.invoiceService.create(param, this.candidateCode, this.externalResourceName).subscribe((resp => {
      this.model.id = resp.body.id;
      this.model.code = resp.body.code;
      this.toastr.success('Save successfully!');
    }), (error2 => {
      this.toastr.error('Fail to save!');
    }));
  }

  buildParam(model): InvoiceReq {
    const poParam = {...model} as InvoiceReq;
    poParam.purchaseOrders = model.purchaseOrders.map((po) => po.poNo);
    return poParam;
  }

  download() {
    this.invoiceService.download(this.model.id).subscribe((resp) => {
      const url = URL.createObjectURL(resp);
      const link = this.downloadLink.nativeElement;
      link.href = url;
      link.download = this.getPOName(this.model);
      link.click();
    });
  }

  getPOName(po: InvoiceReq): string {
    return po.resourceName + '.xlsx';
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
