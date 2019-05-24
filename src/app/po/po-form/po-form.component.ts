import {Component, OnInit} from '@angular/core';
import {PoService} from '../../service/po.service';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {PODefaullt} from "../../model/PODefaullt";

@Component({
  selector: 'app-po-form',
  templateUrl: './po-form.component.html',
  styleUrls: ['./po-form.component.scss']
})
export class PoFormComponent implements OnInit {
  assignmentId: number = null;
  poId: number = null;
  defaultPo;
  model: PODefaullt = {} as PODefaullt;
  isShowForm = false;

  constructor(private route: ActivatedRoute,
              private toastr: ToastrService,
              private  poService: PoService) {
  }

  ngOnInit() {
    this.assignmentId = +this.route.snapshot.paramMap.get('assignmentId');
    this.poId = +this.route.snapshot.paramMap.get('poId');
    this.getDefaultPo();
  }

  getDefaultPo() {
    this.poService.getDefaultPo(this.assignmentId).subscribe((resp) => {
      console.log(resp.body);
      this.defaultPo = resp.body;
      this.model = {...this.defaultPo} as PODefaullt;
      this.isShowForm = true;
      console.log(this.model);
    }, (err) => {
      this.toastr.error('Fail to get default purchase order data');
    });
  }

}
