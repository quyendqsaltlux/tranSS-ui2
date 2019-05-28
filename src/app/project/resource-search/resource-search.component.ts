import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TypeaheadMatch} from 'ngx-bootstrap';
import {Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {CandidateService} from '../../service/candidate.service';

@Component({
  selector: 'app-project-resoure-search',
  templateUrl: './resource-search.component.html',
  styleUrls: ['./resource-search.component.scss']
})
export class ResourceSearchComponent implements OnInit {
  title: string;
  list: any[] = [];
  asyncSelected: string;
  typeaheadLoading: boolean;
  dataSource: Observable<any>;
  noResult = false;
  selectedOption: any;
  isConfirmed = false;
  AVATAR_SIZE_SLIM = 26;
  AVATAR_SIZE_MEDIUM = 32;

  @Input() model;
  @Input() f;
  @Input() viewControl;
  @Output() selectTaskSourceTarget: EventEmitter<any> = new EventEmitter();
  @Output() toggleExternalResource: EventEmitter<any> = new EventEmitter();
  selectedAbility;

  constructor(private resourceService: CandidateService) {
    this.dataSource = Observable.create((observer: any) => {
      observer.next(this.asyncSelected);
    }).pipe(
      mergeMap((token: string) => this.getEmployeeAsObserble(token))
    );
  }

  ngOnInit() {
    this.selectedOption = this.model.candidate;
    this.selectedAbility = this.model.abilityId;
  }

  getEmployeeAsObserble(keyword): Observable<any> {
    return this.resourceService.findResourceForProject(keyword).pipe(
      map(resp => resp.body),
    );
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
  }

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;
    this.model.candidateCode = this.selectedOption.code;
  }

  onChangeAbility(event) {
    if (!event) {
      return;
    }
    this.model.abilityId = event.id;
    this.model.task = event.task;
    this.model.source = event.sourceLanguage;
    this.model.target = event.targetLanguage;
    this.selectTaskSourceTarget.emit(event);
  }

  onToggleUseCustomTask() {
    this.onChangeAbility(this.selectedOption.abilities[this.selectedAbility]);
  }

  onToggleExternalResource() {
    this.selectedAbility = null;
    this.model.useCustomTask = false;
    this.toggleExternalResource.emit(true);
  }
}
