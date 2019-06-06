import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-po-actions-cell',
  templateUrl: './invoice-actions-cell.component.html',
  styleUrls: ['./invoice-actions-cell.component.scss']
})
export class InvoiceActionsCellComponent implements ICellRendererAngularComp {
  public params: any;
  isConfirmed = false;

  agInit(params: any): void {
    this.params = params;
    this.isConfirmed = this.params.data.isConfirmed;
  }

  onEdit() {
    this.params.context.componentParent.onEdit(this.params.node.rowIndex);
  }

  onDelete() {
    this.params.context.componentParent.onDelete(this.params.node.rowIndex);
  }

  onMarkConfirm() {
    this.params.context.componentParent.onMarkConfirm(this.params.node.rowIndex);
  }

  onMarkUnConfirm() {
    this.params.context.componentParent.onMarkUnConfirm(this.params.node.rowIndex);
  }

  refresh(): boolean {
    return false;
  }
}
