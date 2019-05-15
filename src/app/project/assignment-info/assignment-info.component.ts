import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-assignment-info',
  templateUrl: './assignment-info.component.html',
  styleUrls: ['./assignment-info.component.scss']
})
export class AssignmentInfoComponent implements OnInit {
  @Input() assignments = [];

  constructor() {
  }

  ngOnInit() {
  }

}
