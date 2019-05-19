import {AfterViewInit, Component} from '@angular/core';
import {IFloatingFilter, IFloatingFilterParams, SerializedTextFilter} from 'ag-grid-community';
import {AgFrameworkComponent} from 'ag-grid-angular';
import {CombinedFilter} from 'ag-grid-community/dist/lib/filter/baseFilter';
import {Subject} from 'rxjs/index';
import {debounceTime, distinctUntilChanged} from 'rxjs/internal/operators';

export interface AbilityFilterChange {
  model: SerializedTextFilter;
}

export interface AbilityFilterParams extends IFloatingFilterParams<SerializedTextFilter, AbilityFilterChange> {
  value: number;
  maxValue: number;
}

@Component({
  template: `
    <input #input (ngModelChange)="userQuestionUpdate.next($event)" [(ngModel)]="currentValue">
  `
})
export class AbilityFilterComponent implements IFloatingFilter<SerializedTextFilter, AbilityFilterChange, AbilityFilterParams>,
  AgFrameworkComponent<AbilityFilterParams>, AfterViewInit {

  private params: AbilityFilterParams;
  public maxValue: number;
  public currentValue: string;
  userQuestionUpdate = new Subject<string>();

  agInit(params: AbilityFilterParams): void {
    this.params = params;
    this.maxValue = this.params.maxValue;
    this.currentValue = null;
  }

  ngAfterViewInit() {
    this.userQuestionUpdate.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(value => {
        this.valueChanged(value);
      });
  }

  valueChanged(event) {
    this.params.onFloatingFilterChanged({model: this.buildModel(event)});
  }

  buildModel(event): SerializedTextFilter {
    if (!event) {
      return null;
    }
    return {
      filterType: 'text',
      type: 'contains',
      filter: event
    };
  }

  onParentModelChanged(parentModel: SerializedTextFilter, combinedModel?: CombinedFilter<SerializedTextFilter>): void {
  }
}
