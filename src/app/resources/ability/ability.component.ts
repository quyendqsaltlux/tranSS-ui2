import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';
import {CandidateAbilityService} from '../../service/candidate-ability.service';
import {ToastrService} from 'ngx-toastr';
import {CandidateAbility} from '../../model/CandidateAbility';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';

@Component({
  selector: 'app-ability',
  templateUrl: './ability-tb.component.html',
  styleUrls: ['./ability.component.scss']
})
export class AbilityComponent implements OnInit {
  @ViewChild('f') f: NgForm;
  @Input() ability: any;
  @Input() currency: any;
  @Input() index: number;
  @Output() _onDelete: EventEmitter<any> = new EventEmitter();
  candidateId = null;
  modalRef: BsModalRef;
  model: CandidateAbility = {} as CandidateAbility;
  alerts = [];
  @Output() saveOk: EventEmitter<any> = new EventEmitter();

  constructor(private route: ActivatedRoute,
              private abilityService: CandidateAbilityService,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.candidateId = +this.route.snapshot.paramMap.get('candidateId');
    this.model = this.ability;
  }

  outSideSubmit() {
    this.f.onSubmit(event);
  }

  onSubmit() {
    this.alerts = [];
    if (!this.isFormValid()) {
      return;
    }
    this.abilityService.save(this.model).subscribe((resp) => {
      // this.toastr.success('Save successfully!');
      this.model.id = resp.body.id;
      this.saveOk.emit({index: this.index, value: this.model});
    }, (err) => {
      let errors;
      if (err.error && err.error.apierror && err.error.apierror.subErrors) {
        errors = err.error.apierror.subErrors;
      }
      if (!errors || errors.length === 0) {
        this.alerts.unshift({
          type: 'danger',
          msg: 'Fail to save'
        });
      }
      errors.forEach((error) => {
        this.alerts.unshift({
          type: 'danger',
          msg: error.field + '(= ' + error.rejectedValue + ') ' + error.message
        });
      });

    });
  }

  isFormValid() {
    return this.f.valid;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'} as ModalOptions);
  }

  confirm(): void {
    this.modalRef.hide();
    this._onDelete.emit({index: this.index, data: this.model});
  }

  decline(): void {
    this.modalRef.hide();
  }

  onClosed(dismissedAlert) {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  onDelete() {
    this._onDelete.emit(this.index);
  }
}
