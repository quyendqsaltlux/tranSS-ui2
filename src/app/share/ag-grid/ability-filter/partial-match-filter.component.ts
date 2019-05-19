import {Component, ViewChild, ViewContainerRef} from '@angular/core';

import {IAfterGuiAttachedParams, IDoesFilterPassParams, IFilterParams, RowNode} from 'ag-grid-community';
import {IFilterAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-filter-cell',
  template: `<input #input (ngModelChange)="onChange($event)" [ngModel]="text">`, styles: []
})
export class PartialMatchFilterComponent implements IFilterAngularComp {
  private params: IFilterParams;
  private valueGetter: (rowNode: RowNode) => any;
  public text = '';

  @ViewChild('input', {read: ViewContainerRef}) public input;

  agInit(params: IFilterParams): void {
    this.params = params;
    this.valueGetter = params.valueGetter;
  }

  isFilterActive(): boolean {
    return this.text !== null && this.text !== undefined && this.text !== '';
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return this.text.toLowerCase()
      .split(' ')
      .every((filterWord) => {
        return this.valueGetter(params.node).toString().toLowerCase().indexOf(filterWord) >= 0;
      });
  }

  getModel(): any {
    return {value: this.text};
  }

  setModel(model: any): void {
    this.text = model ? model.value : '';
  }
  // noinspection JSMethodCanBeStatic
  componentMethod(message: string): void {
    alert(`Alert from PartialMatchFilterComponent ${message}`);
  }

  onChange(newValue): void {
    console.log('onchange', newValue);
    if (this.text !== newValue) {
      this.text = newValue;
      this.params.filterChangedCallback();
    }
  }
}
