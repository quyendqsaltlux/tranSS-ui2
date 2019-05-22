import {AfterViewInit, Component, EventEmitter, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {CandidateAbilityService} from '../../service/candidate-ability.service';
import {ActivatedRoute} from '@angular/router';
import {CandidateAbility} from '../../model/CandidateAbility';
import {AbilityComponent} from '../ability/ability.component';

@Component({
  selector: 'app-abilities',
  templateUrl: './abilities.component.html',
  styleUrls: ['./abilities.component.scss']
})
export class AbilitiesComponent implements OnInit, AfterViewInit {
  @ViewChildren(AbilityComponent) abilitiesViewChild: QueryList<AbilityComponent>;
  abilities = [];
  candidateId = null;
  isAfterViewInit = false;
  alerts = [];

  constructor(private route: ActivatedRoute,
              private abilityService: CandidateAbilityService,
              private toastr: ToastrService) {
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
      this.abilities = resp.body;
    }, (err) => {
      this.toastr.error('Fail to get data');
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

  onDeleteAbility(event) {
    if (event.data.id == null) {
      this.abilities.splice(event.index, 1);
      this.toastr.success('Delete successfully!');
    } else {
      this.abilityService.delete(event.data.id).subscribe((resp) => {
        this.abilities.splice(event.index, 1);
        this.toastr.success('Delete successfully!');
      });
    }
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
