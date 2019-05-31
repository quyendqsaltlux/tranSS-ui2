import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-po-actions-cell',
  templateUrl: './audit-po-actions-cell.component.html',
  styleUrls: ['./audit-po-actions-cell.component.scss']
})
export class AuditPoActionsCellComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  goToInvoiceForm() {
    this.params.context.componentParent.goToInvoiceForm(this.params.node.rowIndex);
  }

  refresh(): boolean {
    return false;
  }
}
