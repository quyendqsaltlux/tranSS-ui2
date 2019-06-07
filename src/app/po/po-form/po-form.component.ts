import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PoService} from '../../service/po.service';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PODefault} from '../../model/PODefaullt';
import {POReq} from '../../model/POReq';

@Component({
  selector: 'app-po-form',
  templateUrl: './po-form.component.html',
  styleUrls: ['./po-form.component.scss']
})
export class PoFormComponent implements OnInit {
  @ViewChild('downloadLink') private downloadLink: ElementRef;
  assignmentId: number = null;
  poId: number = null;
  defaultPo;
  model: PODefault = {} as PODefault;
  isShowForm = false;

  constructor(private route: ActivatedRoute,
              private toastr: ToastrService,
              private  poService: PoService) {
  }

  ngOnInit() {
    this.isShowForm = false;
    this.assignmentId = +this.route.snapshot.paramMap.get('assignmentId');
    this.poId = +this.route.snapshot.paramMap.get('poId');
    if (isNaN(this.poId)) {
      this.poId = null;
    }
    if (!this.poId) {
      this.getDefaultPo();
    } else {
      this.getModel();
    }
  }

  getModel() {
    this.poService.findById(this.poId).subscribe((resp) => {
      this.model = resp.body as PODefault;
      this.roundTotalByCurrency(this.model.currency);
      this.isShowForm = true;
    });
  }

  roundTotalByCurrency(currency) {
    if (!currency) {
      return;
    }
    let suffix = 2;
    if ('KRW' === currency) {
      suffix = 0;
    }
    this.model.assignment.total = Number((this.model.assignment.total).toFixed(suffix));
  }

  getDefaultPo() {
    this.poService.getDefaultPo(this.assignmentId).subscribe((resp) => {
      this.defaultPo = resp.body;
      this.model = {...this.defaultPo} as PODefault;
      this.model.currency = this.defaultPo.assignment.ability ? this.defaultPo.assignment.ability.currency : null;
      this.roundTotalByCurrency(this.model.currency);
      this.isShowForm = true;
    }, () => {
      this.toastr.error('Fail to get default purchase order data');
    });
  }

  onSubmit() {
    const param = this.buildParam(this.model);
    this.poService.create(param, this.assignmentId).subscribe((resp => {
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
    this.poService.downloadPO(this.model.id).subscribe((resp) => {
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
