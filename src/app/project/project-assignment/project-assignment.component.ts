import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ProjectAssignmentReq} from '../../model/ProjectAssignmenReq';
import {ProjectAssignmentService} from '../../service/project-assignment.service';
import {IndividualConfig, ToastrService} from 'ngx-toastr';
import {combineLatest, Subject, Subscription} from 'rxjs/index';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {SpecificCommentComponent} from '../../evaluation/specific-comment/specific-comment.component';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-project-assignment',
  templateUrl: './project-assignment.component.html',
  styleUrls: ['./project-assignment.component.scss']
})
export class ProjectAssignmentComponent implements OnInit {
  @ViewChild('f') f: NgForm;
  @Input() index;
  @Input() viewControl;
  @Input() assignment;
  @Input() projectId;
  @Input() projectCode;
  @Output() saveDone: EventEmitter<any> = new EventEmitter();
  @Output() deleteItem: EventEmitter<any> = new EventEmitter();

  currentAbility;

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
    if (this.assignment) {
      this.model = {...this.assignment} as ProjectAssignmentReq;
    }
    this.model.projectId = Number(this.projectId);
    this.model.projectCode = this.projectCode;
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

  onUnitPriceChanged() {
    this.updateTotalMoney();
  }

  onRepInputChanged() {
    this.model.totalRep = this.computeTotalRep();
    this.upDateNetOrHour();
  }

  onWfInputChanged() {
    this.upDateNetOrHour();
  }

  upDateNetOrHour() {
    if (!this.model.notAutoComputeNetHour) {
      this.model.netOrHour = this.computeNetOrHour();
      this.onNetOrHourChanged();
    }
  }

  onNetOrHourChanged() {
    if (!this.model.externalResource) {
      this.model.unitPrice = this.getUnitPrice(this.currentAbility, this.model.netOrHour);
    }
    this.updateTotalMoney();
  }

  updateTotalMoney() {
    this.model.total = this.model.netOrHour * this.model.unitPrice;
  }

  onSelectTaskSourceTarget(ability) {
    this.currentAbility = ability;
    this.onToggleCustomizeWf();
    this.onWfInputChanged();
  }

  onToggleAutoComputeNetOrHour() {
    this.upDateNetOrHour();
  }

  onToggleCustomizeWf() {
    const ability = this.currentAbility;
    this.model.wrep = Number(ability.wrep);
    this.model.w100 = Number(ability.w100);
    this.model.w99_95 = Number(ability.w99_95);
    this.model.w94_85 = Number(ability.w94_85);
    this.model.w84_75 = Number(ability.w84_75);
    this.model.wnoMatch = Number(ability.wnoMatch);
    this.upDateNetOrHour();
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
    return sum;
  }

  private getUnitPrice(ability, netOrHour) {
    if (!ability) {
      return 0;
    }
    return netOrHour > ability.minimumVolum ? ability.rate : ability.rate2;
  }
}
