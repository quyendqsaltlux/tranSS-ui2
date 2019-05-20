import {Component, OnInit} from '@angular/core';
import {PoService} from '../../service/po.service';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-po-form',
  templateUrl: './po-form.component.html',
  styleUrls: ['./po-form.component.scss']
})
export class PoFormComponent implements OnInit {
  assignmentId: number = null;
  defaultPo;
  model: {};

  constructor(private route: ActivatedRoute,
              private toastr: ToastrService,
              private  poService: PoService) {
  }

  ngOnInit() {
    this.assignmentId = +this.route.snapshot.paramMap.get('assignmentId');
    this.getDefaultPo();
  }

  getDefaultPo() {
    this.poService.getDefaultPo(this.assignmentId).subscribe((resp) => {
      console.log(resp.body);
      this.defaultPo = resp.body;
      this.model = {...this.defaultPo};
    }, (err) => {
      this.toastr.error('Fail to get default purchase orider data');
    });
  }

}
