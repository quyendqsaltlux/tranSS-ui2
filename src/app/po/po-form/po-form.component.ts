import {Component, OnInit} from '@angular/core';
import {PoService} from '../../service/po.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-po-form',
  templateUrl: './po-form.component.html',
  styleUrls: ['./po-form.component.scss']
})
export class PoFormComponent implements OnInit {
  assignmentId: number = null;

  constructor(private route: ActivatedRoute,
              private  poService: PoService) {
  }

  ngOnInit() {
    this.assignmentId = +this.route.snapshot.paramMap.get('candidateId');
  }

}
