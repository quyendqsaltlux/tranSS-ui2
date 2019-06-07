import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-date-cell',
  templateUrl: './progress-cell.component.html',
  styleUrls: ['./progress-cell.component.scss']
})
export class ProgressCellComponent implements ICellRendererAngularComp {
  public params: any;
  value = 0;
  renderField: '';

  agInit(params: any): void {
    this.params = params;
    this.renderField = this.params.renderField;
    this.value = this.params.data[this.renderField];
    if (!this.value) {
      this.value = 0;
    }
  }

  refresh(): boolean {
    return false;
  }

  getPercent(value) {
    return Number((100 * Number(value)).toFixed(0));
  }
}
