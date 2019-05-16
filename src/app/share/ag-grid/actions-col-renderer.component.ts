import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-child-cell',
  templateUrl: './actions-col-renderer.component.html',
  styles: []
})
export class ActionsColRendererComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  onEdit() {
    this.params.context.componentParent.gotoEditForm(this.params.node.rowIndex);
  }

  onDelete() {
    this.params.context.componentParent.onClickDelete(this.params.node.rowIndex);
  }

  refresh(): boolean {
    return false;
  }
}
