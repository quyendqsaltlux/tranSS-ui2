import {Component, Input, OnInit} from '@angular/core';
import {EvaluationService} from '../../service/evaluation.service';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.scss']
})
export class EvaluationComponent implements OnInit {
  @Input() candidateId;
  specificComments = [];

  constructor(private evaluationService: EvaluationService) {
  }

  ngOnInit() {
    this.getSpecificComments();

  }

  getSpecificComments() {
    // this.evaluationService.findSpecificCommentById();
  }
}
