import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {SerializedTextFilter} from "ag-grid-community";

@Component({
  selector: 'app-ability-cell',
  templateUrl: './ability-cell.component.html',
  styleUrls: ['./ability-cell.component.scss']
})
export class AbilityCellComponent implements ICellRendererAngularComp {
  public params: any;
  filters = [];
  abilities = [];
  renderField: '';
  orderFields = ['sourceLanguage', 'targetLanguage', 'projectType', 'rate', 'rateUnit', 'rate2', 'rate2unit', 'minimumCharge', 'task'];
  shownModelList = [];

  agInit(params: any): void {
    this.params = params;
    this.abilities = this.params.data.abilities;
    this.renderField = this.params.renderField;
  }

  onEdit() {
    this.params.context.componentParent.gotoEditForm(this.params.node.rowIndex);
  }

  onViewHistory() {
    this.params.context.componentParent.onViewHistory(this.params.node.rowIndex);
  }

  refresh(): boolean {
    return false;
  }
}
