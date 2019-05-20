import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EvaluationService} from '../../service/evaluation.service';
import {IndividualConfig, ToastrService} from 'ngx-toastr';
import {SpecificComment} from '../../model/SpecificComment';

@Component({
  selector: 'app-specific-comment',
  templateUrl: './specific-comment.component.html',
  styleUrls: ['./specific-comment.component.scss']
})
export class SpecificCommentComponent implements OnInit {
  @Output() closeForm: EventEmitter<any> = new EventEmitter();
  @Input() assignmentId;
  model = {} as SpecificComment;

  constructor(private  evaluationService: EvaluationService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.model.assignmentId = this.assignmentId;
    this.getCurrentEvaluation();
  }

  getCurrentEvaluation() {
    this.evaluationService.findSpecificCommentById(this.assignmentId).subscribe((resp) => {
      this.model = resp.body;
      this.model.assignmentId = this.assignmentId;
    });
  }

  reviewAssignment() {
    this.evaluationService.saveSpecificComment(this.model)
      .subscribe((resp) => {
          this.toastr.success('Change progress successfully!');
        },
        ((err) => {
          this.toastr.error(err.error.message, 'Fail to evaluate!', {timeOut: 10000} as Partial<IndividualConfig>);
        }));
  }

  onToggleReviewForm() {
    this.closeForm.emit(true);
  }
}
