import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProjectAssignmentReq} from '../../model/ProjectAssignmenReq';
import {ProjectAssignmentService} from '../../service/project-assignment.service';
import {IndividualConfig, ToastrService} from 'ngx-toastr';
import {combineLatest, Subject, Subscription} from 'rxjs/index';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {SpecificCommentComponent} from '../../evaluation/specific-comment/specific-comment.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-project-assignment',
  templateUrl: './project-assignment.component.html',
  styleUrls: ['./project-assignment.component.scss']
})
export class ProjectAssignmentComponent implements OnInit {
  @Input() index;
  @Input() viewControl;
  @Input() assignment;
  @Input() projectId;
  @Input() projectCode;
  @Output() saveDone: EventEmitter<any> = new EventEmitter();
  @Output() deleteItem: EventEmitter<any> = new EventEmitter();

  bsModalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  model: ProjectAssignmentReq = {} as ProjectAssignmentReq;
  isShowReviewForm = false;
  star = 5;
  private repSubjects: Subject<string>[] = [];
  repSubjectFields = [];

  constructor(private  projectAssignmentService: ProjectAssignmentService,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private changeDetection: ChangeDetectorRef,
              private route: Router) {
  }

  ngOnInit() {
    this.initSubjects();
    this.extractApiModel();
  }

  initSubjects() {
    this.repSubjectFields.forEach(field => {
      this.repSubjects[field] = new Subject();
    });
  }

  extractApiModel() {
    this.model.projectId = Number(this.projectId);
    this.model.projectCode = this.projectCode;
    if (this.assignment) {
      this.model.id = this.assignment.id;
      this.model.task = this.assignment.task;
      this.model.ho = this.assignment.ho;
      this.model.hb = this.assignment.hb;
      this.model.total = this.assignment.total;
      this.model.source = this.assignment.source;
      this.model.target = this.assignment.target;
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
      if (error.apierror >= 0 && error.apierror.status === 'CONFLICT') {
        this.toastr.error('This assignment was existed!', 'Fail to Assign');
        return;
      }
      this.toastr.error(error.message, 'Fail to Assign!', {timeOut: 10000} as Partial<IndividualConfig>);
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
        this.toastr.error(err.error.message, 'Fail to Assign!', {timeOut: 10000} as Partial<IndividualConfig>);
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
        this.toastr.error(err.error.message, 'Fail to Change progress!', {timeOut: 10000} as Partial<IndividualConfig>);
      }));
  }

  onToggleReviewForm(e) {
    this.isShowReviewForm = !this.isShowReviewForm;
  }

  onDeleteResource() {
    this.deleteItem.emit(this.index);
  }

  openNewGeneralCommentModal() {
    const _combine = combineLatest(
      this.modalService.onHide,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
      })
    );
    this.subscriptions.push(
      this.modalService.onHidden.subscribe((reason: string) => {
        console.log(reason);
        this.onModalClose(this.bsModalRef.content);
        this.unsubscribe();
      })
    );

    this.subscriptions.push(_combine);

    const initialState = {
      title: 'Specific comment',
      assignmentId: this.assignment.id
    };
    this.bsModalRef = this.modalService.show(SpecificCommentComponent, {initialState} as ModalOptions);
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  onModalClose(modalContent) {
  }

  goToPo(assignmentId) {
    this.route.navigate(['/purchaseOrders/' + assignmentId + '/new']);
  }

  isComputeNetHourManually() {
    return !(this.model && this.model.reprep >= 0 && this.model.rep100 >= 0 && this.model.rep99_95
      >= 0 && this.model.rep94_85 >= 0 && this.model.rep84_75 >= 0 && this.model.repnoMatch
      >= 0 && this.model.notAutoComputeNetHour);
  }

  onRepInputChanged(event) {
    console.log(event);
  }
}
