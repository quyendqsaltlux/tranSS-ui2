import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-evaluation-actions-cell',
  templateUrl: './evaluation-actions-cell.component.html'
})
export class EvaluationActionsCellComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  onEdit() {
    this.params.context.componentParent.onEdit(this.params.node.rowIndex);
  }

  onDelete() {
    this.params.context.componentParent.onDelete(this.params.node.rowIndex);
  }

  refresh(): boolean {
    return false;
  }
}
