import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EvaluationService} from '../../service/evaluation.service';
import {IndividualConfig, ToastrService} from 'ngx-toastr';
import {SpecificComment} from '../../model/SpecificComment';
import {BsModalRef} from "ngx-bootstrap";

@Component({
  selector: 'app-specific-comment',
  templateUrl: './specific-comment.component.html',
  styleUrls: ['./specific-comment.component.scss']
})
export class SpecificCommentComponent implements OnInit {
  assignmentId;
  model = {} as SpecificComment;

  constructor(public bsModalRef: BsModalRef,
              private  evaluationService: EvaluationService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    if (!this.model || !this.model.id) {
      this.model.assignmentId = this.assignmentId;
      this.getCurrentEvaluation();
    }
  }

  getCurrentEvaluation() {
    this.evaluationService.findSpecificCommentById(this.assignmentId).subscribe((resp) => {
      this.model = resp.body;
      this.model.assignmentId = this.assignmentId;
    });
  }

  reviewAssignment() {
    this.evaluationService.saveSpecificComment(this.model, this.assignmentId).subscribe((resp) => {
        this.toastr.success('Saved successfully!');
        this.bsModalRef.hide();
      },
      ((err) => {
        this.toastr.error(err.error.message, 'Fail to evaluate!', {timeOut: 10000} as Partial<IndividualConfig>);
      }));
  }

  cancel() {
    this.bsModalRef.hide();
  }
}
