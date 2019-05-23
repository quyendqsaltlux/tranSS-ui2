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

  repFields = ['reprep', 'rep100', 'rep99_95', 'rep94_85', 'rep84_75', 'repnoMatch'];
  wrepFields = ['wrep', 'w100', 'w99_95', 'w94_85', 'w84_75', 'wnoMatch'];

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

  onRepInputChanged() {
    this.model.totalRep = this.computeTotalRep();
    this.upDateNetHour();
  }

  onWfInputChanged() {
    this.upDateNetHour();
  }

  upDateNetHour() {
    if (!this.model.notAutoComputeNetHour) {
      this.model.netOrHour = this.computeNetOrHour();
    }
  }

  onSelectTaskSourceTarget(event) {
    if (!this.model.notUseRDBWf) {
      this.model.wrep = Number(event.wrep) / 100;
      this.model.w100 = Number(event.w100) / 100;
      this.model.w99_95 = Number(event.w99_95) / 100;
      this.model.w94_85 = Number(event.w94_85) / 100;
      this.model.w84_75 = Number(event.w84_75) / 100;
      this.model.wnoMatch = Number(event.wnoMatch) / 100;

      this.onWfInputChanged();
    }
  }

  computeTotalRep() {
    let totalRep = 0;
    this.repFields.forEach((field) => {
      if (Number(this.model[field]) >= 0) {
        totalRep += this.model[field];
      }
    });
    return totalRep;
  }

  computeNetOrHour() {
    const size = this.wrepFields.length;
    let index: number;
    let sum = 0;
    for (index = 0; index < size; index++) {
      const a = Number(this.model[this.repFields[index]]);
      const b = Number(this.model[this.wrepFields[index]]);
      if (!isNaN(a) && !isNaN(b)) {
        sum += a * b;
      }
    }
    console.log(sum);
    return sum;
  }
}
