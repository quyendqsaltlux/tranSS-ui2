import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProjectAssignmentReq} from '../../model/ProjectAssignmenReq';
import {ProjectAssignmentService} from '../../service/project-assignment.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-project-assignment',
  templateUrl: './project-assignment.component.html',
  styleUrls: ['./project-assignment.component.scss']
})
export class ProjectAssignmentComponent implements OnInit {
  @Input() assignment;
  @Input() projectId;
  @Output() saveDone: EventEmitter<any> = new EventEmitter();

  model: ProjectAssignmentReq = <ProjectAssignmentReq>{};
  isShowReviewForm = false;
  star = 5;

  constructor(private  projectAssignmentService: ProjectAssignmentService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.extractApiModel();
  }

  extractApiModel() {
    this.model.projectId = Number(this.projectId);
    if (this.assignment) {
      this.model.id = this.assignment.id;
      this.model.task = this.assignment.task;
      this.model.ho = this.assignment.ho;
      this.model.hb = this.assignment.hb;
      this.model.candidateCode = this.assignment.candidate ? this.assignment.candidate.code : null;
      if (this.assignment.star) {
        this.star = this.assignment.star;
      }
    }
  }

  onSubmit() {
    this.projectAssignmentService.create(this.model).subscribe((resp) => {
      this.toastr.success('Assigned successfully!');
      this.saveDone.emit(true);
    }, (err) => {
      const error = err.error;
      if (error.apierror && error.apierror.status === 'CONFLICT') {
        this.toastr.error('This assignment was existed!', 'Fail to Assign');
        return;
      }
      this.toastr.error(error.message, 'Fail to Assign!', {timeOut: 10000});
    });
  }

  onChangeConfirmStatus(status) {
    if (status === this.assignment.status) {
      return;
    }
    this.projectAssignmentService.changeStatus(this.assignment.id, status).subscribe((resp) => {
        this.toastr.success('Assigned successfully!');
        this.assignment = {...resp.body};
      },
      ((err) => {
        this.toastr.error(err.error.message, 'Fail to Assign!', {timeOut: 10000});
      }));
  }

  onChangeProgress(progress) {
    if (progress === this.assignment.progress) {
      return;
    }
    this.projectAssignmentService.changeProgress(this.assignment.id, progress).subscribe((resp) => {
        this.toastr.success('Change progress successfully!');
        this.assignment = {...resp.body};
      },
      ((err) => {
        this.toastr.error(err.error.message, 'Fail to Change progress!', {timeOut: 10000});
      }));
  }

  reviewAssignment() {
    this.projectAssignmentService.review(this.assignment.id, this.assignment.review, this.star)
      .subscribe((resp) => {
          this.toastr.success('Change progress successfully!');
          this.assignment = {...resp.body};
        },
        ((err) => {
          this.toastr.error(err.error.message, 'Fail to review!', {timeOut: 10000});
        }));
  }

  onToggleReviewForm() {
    this.isShowReviewForm = !this.isShowReviewForm;
  }
}
