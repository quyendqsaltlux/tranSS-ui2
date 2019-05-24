import {Component, OnInit} from '@angular/core';
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
    if (!this.poId) {
      this.getDefaultPo();
    } else {
      this.getModel();
    }
  }

  getModel() {
    this.poService.findById(this.poId).subscribe((resp) => {
      this.model = resp.body as PODefault;
      this.isShowForm = true;
    });
  }

  getDefaultPo() {
    this.poService.getDefaultPo(this.assignmentId).subscribe((resp) => {
      this.defaultPo = resp.body;
      this.model = {...this.defaultPo} as PODefault;
      this.model.currency = this.defaultPo.assignment.ability.currency;
      this.isShowForm = true;
    }, (err) => {
      this.toastr.error('Fail to get default purchase order data');
    });
  }

  onSubmit() {
    const param = this.buildParam(this.model);
    this.poService.create(param, this.assignmentId).subscribe((resp => {
      this.model.id = resp.body.id;
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
  }
}
