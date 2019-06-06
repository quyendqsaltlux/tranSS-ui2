import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import * as moment from 'moment';

@Component({
  selector: 'app-date-cell',
  templateUrl: './project-urgent-cell.component.html',
  styleUrls: ['./project-urgent-cell.component.scss']
})
export class ProjectUrgentCellComponent implements ICellRendererAngularComp {
  public params: any;
  value = [];
  renderField: '';
  isDanger = false;
  isWarning = false;

  agInit(params: any): void {
    this.params = params;
    this.renderField = this.params.renderField;
    this.value = this.params.data[this.renderField];
    this.updateIsRed(this.params.data.hb);
  }

  refresh(): boolean {
    return false;
  }

  updateIsRed(hb) {
    if (!hb) {
      return;
    }
    const date = new Date();
    const formattedDate = moment(date).format('YYYY-MM-DD');
    this.isWarning = moment(hb).isBefore(formattedDate);
    this.isDanger = moment(hb).isSame(formattedDate);
  }
}
