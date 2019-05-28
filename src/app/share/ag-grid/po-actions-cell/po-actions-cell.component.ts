import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-po-actions-cell',
  templateUrl: './po-actions-cell.component.html',
  styleUrls: ['./po-actions-cell.component.scss']
})
export class PoActionsCellComponent implements ICellRendererAngularComp {
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
