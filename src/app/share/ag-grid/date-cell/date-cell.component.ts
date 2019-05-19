import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-date-cell',
  templateUrl: './date-cell.component.html',
  styleUrls: ['./date-cell.component.scss']
})
export class DateCellComponent implements ICellRendererAngularComp {
  public params: any;
  dateValue = [];
  renderField: '';

  agInit(params: any): void {
    this.params = params;
    this.renderField = this.params.renderField;
    this.dateValue = this.params.data[this.renderField];
  }

  refresh(): boolean {
    return false;
  }

}
