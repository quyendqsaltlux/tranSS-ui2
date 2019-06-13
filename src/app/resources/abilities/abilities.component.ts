import {AfterViewInit, Component, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {CandidateAbilityService} from '../../service/candidate-ability.service';
import {ActivatedRoute} from '@angular/router';
import {CandidateAbility} from '../../model/CandidateAbility';
import {AbilityComponent} from '../ability/ability.component';
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap";

@Component({
  selector: 'app-abilities',
  templateUrl: './abilities.component.html',
  styleUrls: ['./abilities.component.scss']
})
export class AbilitiesComponent implements OnInit, AfterViewInit {
  @ViewChild('template') template: TemplateRef<any>;
  @ViewChildren(AbilityComponent) abilitiesViewChild: QueryList<AbilityComponent>;
  abilities = [];
  candidateId = null;
  isAfterViewInit = false;
  alerts = [];
  deleteIndex = -1;
  modalRef: BsModalRef;
  currency: string;

  constructor(private route: ActivatedRoute,
              private abilityService: CandidateAbilityService,
              private toastr: ToastrService,
              private modalService: BsModalService) {
  }

  ngAfterViewInit() {
    this.isAfterViewInit = true;
    this.abilitiesViewChild.changes.subscribe(items => {
      items.toArray().forEach(component => {
        // console.log(component);
      });
    });
  }

  ngOnInit() {
    this.candidateId = +this.route.snapshot.paramMap.get('candidateId');
    this.getListAbilities();
  }

  getListAbilities() {
    this.abilityService.getList(this.candidateId).subscribe((resp) => {
      this.abilities = resp.body.abilities;
      this.currency = resp.body.currency;
    }, (err) => {
      this.toastr.error('Fail to get rates data');
    });
  }

  newAbility() {
    if (this.hasOneNewAbility()) {
      return;
    }
    const newAbility = this.getDefaultAbility();
    newAbility.candidateId = this.candidateId;

    this.abilities.unshift(newAbility);
  }

  private getDefaultAbility(): CandidateAbility {
    const model: CandidateAbility = {} as CandidateAbility;
    model.wrep = 25;
    model.w100 = 20;
    model.w99_95 = 30;
    model.w94_85 = 55;
    model.w84_75 = 80;
    model.wnoMatch = 100;
    return model;
  }

  hasOneNewAbility() {
    if (!this.abilities) {
      return false;
    }
    const found = this.abilities.findIndex((ability) => ability.id == null);
    return found >= 0;
  }

  onDeleteAbility(index) {
    const ability = this.abilities[index];
    if (ability.id == null) {
      this.abilities.splice(index, 1);
      this.toastr.success('Delete successfully!');
      return;
    }
    this.deleteIndex = index;
    this.modalRef = this.modalService.show(this.template, {class: 'modal-sm'} as ModalOptions);
  }

  confirm(): void {
    this.modalRef.hide();
    if (this.deleteIndex < 0) {
      return;
    }
    this.abilityService.delete(this.abilities[this.deleteIndex].id).subscribe((resp) => {
      this.abilities.splice(this.deleteIndex, 1);
      this.toastr.success('Delete successfully!');
      this.deleteIndex = -1;
    }, (error1 => {
      this.toastr.error('Fail to delete!');
      this.deleteIndex = -1;
    }));
  }

  decline(): void {
    this.modalRef.hide();
  }

  onSubmitRates() {
    this.alerts = [];
    let isAllFormValid = true;
    this.abilitiesViewChild.forEach((abilityComponent) => {
      if (!abilityComponent.isFormValid()) {
        abilityComponent.outSideSubmit();
        isAllFormValid = false;
      }
    });
    if (isAllFormValid) {
      this.abilitiesViewChild.forEach((abilityComponent) => {
        abilityComponent.outSideSubmit();
      });
    }
  }

  onClosed(dismissedAlert) {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  onSaveOK(event) {
    this.alerts.unshift({
      type: 'success',
      msg: 'Saved row #' + (event.index + 1) + ' successfully.'
    });
  }
}
