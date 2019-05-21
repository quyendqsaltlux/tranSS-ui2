import {Component, OnInit} from '@angular/core';
import {GeneralComment} from '../../model/GeneralComment';
import {EvaluationService} from '../../service/evaluation.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-general-comment',
  templateUrl: './general-comment.component.html',
  styleUrls: ['./general-comment.component.scss']
})
export class GeneralCommentComponent implements OnInit {
  candidateId;
  model = {} as GeneralComment;

  constructor(public bsModalRef: BsModalRef,
              private evaluationService: EvaluationService,
              private toastr: ToastrService,
              public route: Router) {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.evaluationService.saveGeneralComment(this.model, this.candidateId)
      .subscribe((resp) => {
        this.model.id = resp.body.id;
        this.bsModalRef.hide();
        this.toastr.success('Save successfully!');
      });
  }

  onCancel() {
    this.bsModalRef.hide();
  }
}
