import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-specific-comment-view',
  templateUrl: './specific-comment-view.component.html',
  styleUrls: ['./specific-comment-view.component.scss']
})
export class SpecificCommentViewComponent implements OnInit {
  @Input() modelList: any[];

  constructor() {
  }

  ngOnInit() {
  }

}
