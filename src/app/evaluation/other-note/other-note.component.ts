import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {EvaluationService} from '../../service/evaluation.service';
import {BsModalRef} from 'ngx-bootstrap';
import {OtherNote} from '../../model/OtherNote';

@Component({
  selector: 'app-other-note',
  templateUrl: './other-note.component.html',
  styleUrls: ['./other-note.component.scss']
})
export class OtherNoteComponent implements OnInit {
  candidateId;
  title;
  model = {} as OtherNote;

  constructor(public bsModalRef: BsModalRef,
              private evaluationService: EvaluationService,
              private toastr: ToastrService,
              public route: Router) {
  }

  ngOnInit() {
    console.log(this.candidateId);
  }

  onSubmit() {
    this.evaluationService.saveOtherNote(this.model, this.candidateId)
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
