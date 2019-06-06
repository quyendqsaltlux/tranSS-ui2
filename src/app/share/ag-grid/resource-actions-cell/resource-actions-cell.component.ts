import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-child-cell',
  templateUrl: './resource-actions-cell.component.html',
  styles: []
})
export class ResourceActionsCellComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  onEdit() {
    this.params.context.componentParent.gotoEditForm(this.params.node.rowIndex);
  }

  onViewHistory() {
    this.params.context.componentParent.onViewHistory(this.params.node.rowIndex);
  }

  onViewRates() {
    this.params.context.componentParent.onViewRates(this.params.node.rowIndex);
  }

  onDelete() {
    this.params.context.componentParent.onDelete(this.params.node.rowIndex);
  }

  refresh(): boolean {
    return false;
  }
}
