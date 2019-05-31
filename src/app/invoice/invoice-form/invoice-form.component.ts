import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PODefault} from '../../model/PODefaullt';
import {POReq} from '../../model/POReq';
import {InvoicesService} from '../../service/invoices.service';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss']
})
export class InvoiceFormComponent implements OnInit {
  @ViewChild('downloadLink') private downloadLink: ElementRef;
  candidateCode: string = null;
  invoiceId: number = null;
  defaultPo;
  model: any = {};
  isShowForm = false;

  constructor(private route: ActivatedRoute,
              private toastr: ToastrService,
              private  invoiceService: InvoicesService) {
  }

  ngOnInit() {
    this.isShowForm = false;
    this.candidateCode = this.route.snapshot.paramMap.get('candidateCode');
    this.invoiceId = +this.route.snapshot.paramMap.get('invoiceId') || null;
    console.log(this.candidateCode);
    if (isNaN(this.invoiceId)) {
      this.invoiceId = null;
    }
    if (!this.invoiceId) {
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
      this.defaultPo = resp.body;
      this.model = {...this.defaultPo};
      console.log(this.model)
    }, () => {
      this.toastr.error('Fail to get default purchase order data');
    });
  }

  onSubmit() {
    const param = this.buildParam(this.model);
    this.invoiceService.create(param, this.candidateCode).subscribe((resp => {
      this.model.id = resp.body.id;
      this.model.code = resp.body.code;
      this.toastr.success('Save PO successfully!');
    }), (error2 => {
      this.toastr.error('Fail to save!');
    }));
  }

  buildParam(model): POReq {
    const poParam = {} as POReq;
    poParam.id = model.id;
    poParam.code = model.code;
    poParam.status = model.status;
    poParam.currency = model.currency;
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
}
