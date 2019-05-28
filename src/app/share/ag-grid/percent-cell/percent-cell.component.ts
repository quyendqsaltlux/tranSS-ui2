import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-date-cell',
  templateUrl: './percent-cell.component.html',
  styleUrls: ['./percent-cell.component.scss']
})
export class PercentCellComponent implements ICellRendererAngularComp {
  public params: any;
  value = [];
  renderField: '';

  agInit(params: any): void {
    this.params = params;
    this.renderField = this.params.renderField;
    this.value = this.params.data[this.renderField];
  }

  refresh(): boolean {
    return false;
  }

}
