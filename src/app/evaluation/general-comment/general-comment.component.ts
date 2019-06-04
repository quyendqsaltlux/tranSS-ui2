import {Component, OnInit} from '@angular/core';
import {GeneralComment} from '../../model/GeneralComment';
import {EvaluationService} from '../../service/evaluation.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef} from 'ngx-bootstrap';
import {PrincipleService} from "../../service/principle.service";

@Component({
  selector: 'app-general-comment',
  templateUrl: './general-comment.component.html',
  styleUrls: ['./general-comment.component.scss']
})
export class GeneralCommentComponent implements OnInit {
  candidateId;
  title;
  model = {} as GeneralComment;
  currentUser;

  constructor(public bsModalRef: BsModalRef,
              private principleService: PrincipleService,
              private evaluationService: EvaluationService,
              private toastr: ToastrService,
              public route: Router) {
  }

  ngOnInit() {
    this.currentUser = this.principleService.getUserInfo();
    this.model.evaluator = this.currentUser.username;
    this.model.date = new Date();
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
