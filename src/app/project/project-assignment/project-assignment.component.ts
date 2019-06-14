import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {ProjectAssignmentReq} from '../../model/ProjectAssignmenReq';
import {ProjectAssignmentService} from '../../service/project-assignment.service';
import {IndividualConfig, ToastrService} from 'ngx-toastr';
import {combineLatest, Subject, Subscription} from 'rxjs/index';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {SpecificCommentComponent} from '../../evaluation/specific-comment/specific-comment.component';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {FLOAT_REGEX} from '../../AppConstant';
import {PoService} from '../../service/po.service';
import * as _ from 'lodash';
import {PoFormComponent} from '../../po/po-form/po-form.component';

@Component({
  selector: 'app-project-assignment',
  templateUrl: './project-assignment.component.html',
  styleUrls: ['./project-assignment.component.scss']
})
export class ProjectAssignmentComponent implements OnInit {
  @ViewChild('template') template: TemplateRef<any>;
  _FLOAT_REGEX = FLOAT_REGEX;
  @ViewChild('f') f: NgForm;
  @Input() index;
  @Input() viewControl;
  @Input() assignment;
  @Input() projectId;
  @Input() projectCode;
  @Output() saveDone: EventEmitter<any> = new EventEmitter();
  @Output() deleteItem: EventEmitter<any> = new EventEmitter();

  currentAbility;

  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  poSubscriptions: Subscription[] = [];
  model: ProjectAssignmentReq = {} as ProjectAssignmentReq;
  star = 5;
  private repSubjects: Subject<string>[] = [];
  repSubjectFields = [];

  repFields = ['reprep', 'rep100', 'rep99_95', 'rep94_85', 'rep84_75', 'repnoMatch'];
  wrepFields = ['wrep', 'w100', 'w99_95', 'w94_85', 'w84_75', 'wnoMatch'];

  progress = [
    {id: 1, value: 'WAITING_CONFIRM', label: 'Waiting confirm'},
    {id: 2, value: 'ON_GOING', label: 'On going'},
    {id: 3, value: 'FINISHED', label: 'Finished'}
  ];

  progressDigit = {
    WAITING_CONFIRM: 1,
    ON_GOING: 2,
    FINISHED: 3,
  };
  deleteId = -1;

  constructor(private  projectAssignmentService: ProjectAssignmentService,
              private poService: PoService,
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
      this.currentAbility = this.assignment.ability;
    }
    this.model.projectId = Number(this.projectId);
    this.model.projectCode = this.projectCode;
  }

  buildParam(model) {
    const params = _.cloneDeep(model);
    params.candidateId = params.candidate ? params.candidate.id : null;
    delete params.candidate;
    delete params.ability;
    if (!this.model.externalResource) {
      delete  this.model.externalResourceName;
    }
    return params;
  }

  isFormValid() {
    if (this.model.externalResource) {
      return !this.f.invalid && this.model.externalResourceName && this.model.task && this.model.source && this.model.target;
    }
    if (this.model.useCustomTask) {
      return !this.f.invalid && this.model.task && this.model.source && this.model.target;
    }

    return !this.f.invalid;
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }
    this.projectAssignmentService.create(this.buildParam(this.model)).subscribe((resp) => {
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

  onChangeProgress(progress) {
    if (!this.viewControl.ableToChange || progress === this.assignment.progress) {
      return;
    }
    this.projectAssignmentService.changeProgress(this.assignment.id, progress).subscribe((resp) => {
        this.toastr.success('Change progress successfully!');
        this.assignment = {...resp.body};
        this.model.progress = this.assignment.progress;
      },
      ((err) => {
        this.toastr.error(err.error.message, 'Fail to Change progress!', {timeOut: 10000} as Partial<IndividualConfig>);
      }));
  }

  onDeleteResource() {
    this.deleteItem.emit(this.index);
  }

  openNewSpecificCommentModal() {
    if (!this.viewControl.ableToChange) {
      return;
    }
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
        this.onModalClose(this.modalRef.content);
        this.subscriptions = this._unsubscribe(this.subscriptions);
      })
    );

    this.subscriptions.push(_combine);

    const initialState = {
      title: 'Specific comment',
      assignmentId: this.assignment.id
    };
    this.modalRef = this.modalService.show(SpecificCommentComponent, {initialState} as ModalOptions);
  }

  _unsubscribe(subscriptions) {
    subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    return [];
  }

  onPoModalClose(modalContent) {
    if (modalContent.updated) {
      this.saveDone.emit(true);
    }
  }

  onModalClose(modalContent) {
  }

  openPoModal(_assignmentId, _poId) {
    const _combine = combineLatest(
      this.modalService.onHide,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());

    this.poSubscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
      })
    );
    this.poSubscriptions.push(
      this.modalService.onHidden.subscribe((reason: string) => {
        this.onPoModalClose(this.modalRef.content);
        this.poSubscriptions = this._unsubscribe(this.poSubscriptions);
      })
    );

    this.poSubscriptions.push(_combine);

    const initialState = {
      title: 'Purchase Order',
      assignmentId: _assignmentId,
      poId: _poId
    };
    this.modalRef = this.modalService.show(PoFormComponent, {initialState, class: 'modal-xl'} as ModalOptions);
  }

  deletePo(poId) {
    this.poService.deleteById(poId).subscribe((resp) => {
      this.toastr.success('Delete Po successfully!');
      this.saveDone.emit(true);
    }, (error2) => this.toastr.error('Fail to delete Po!'));
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
    setTimeout(() => {
      this.upDateNetOrHour();
    }, 0);

  }

  upDateNetOrHour() {
    if (!this.model.notAutoComputeNetHour) {
      this.model.netOrHour = this.computeNetOrHour();
      this.onNetOrHourChanged();
    }
  }

  onNetOrHourChanged() {
    setTimeout(() => {
      if (!this.model.externalResource && !this.model.useCustomTask) {
        this.model.unitPrice = this.getUnitPrice(this.currentAbility, this.model.netOrHour);
      }
      this.updateTotalMoney();
    }, 0);
  }

  updateTotalMoney() {
    // this.model.total = Number(( this.model.netOrHour * this.model.unitPrice).toFixed(2));
    this.model.total = Number( this.model.netOrHour * this.model.unitPrice);
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
      const value = Number(this.model[field]);
      if (value >= 0) {
        totalRep += value;
      }
    });
    return totalRep;
  }

  computeNetOrHour() {
    const size = this.wrepFields.length;
    let index: number;
    let sum = 0;
    for (index = 0; index < size; index++) {
      const a = Number(this.model[this.repFields[index]]) || 0;
      const b = Number(this.model[this.wrepFields[index]]) || 0;
      if (!isNaN(a) && !isNaN(b)) {
        sum += a * b;
      }
    }
    // return Number((sum / 100).toFixed(2));
    return Number(sum / 100);
  }

  onToggleExternalResource() {
    this.resetWfAndRepAndOther();
  }

  onToggleUseCustomTask(event) {
    this.model.abilityId = null;
  }

  resetWfAndRepAndOther() {
    const size = this.wrepFields.length;
    let index: number;
    for (index = 0; index < size; index++) {
      this.model[this.repFields[index]] = 0;
      this.model[this.wrepFields[index]] = 0;
    }
    this.model.totalRep = 0;
    this.model.unitPrice = 0;
    this.model.total = 0;
  }

  private getUnitPrice(ability, netOrHour) {
    if (!ability) {
      return 0;
    }
    return netOrHour > ability.minimumVolum ? ability.rate : ability.rate2;
  }

  onClickStone(myStone) {
    this.onChangeProgress(myStone.value);
  }

  openModalDeletePo(id) {
    this.deleteId = id;
    this.modalRef = this.modalService.show(this.template, {class: 'modal-sm'} as ModalOptions);
  }

  confirmDeletePo(): void {
    this.modalRef.hide();
    if (this.deleteId < 0) {
      return;
    }
    this.deletePo(this.deleteId);
  }

  declineDeletePo(): void {
    this.modalRef.hide();
  }
}
