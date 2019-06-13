import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {PrincipleService} from '../../service/principle.service';

@Component({
  selector: 'app-child-cell',
  templateUrl: './actions-col-renderer.component.html',
  styles: []
})
export class ActionsColRendererComponent implements ICellRendererAngularComp {
  public params: any;
  currentUser;
  pmVtc;

  agInit(params: any): void {
    this.params = params;
    this.pmVtc = this.params.data['pmVtc'];
    this.currentUser = this.principleService.getUserInfo();
  }

  isAllowEdit() {
    return this.principleService.isPMLeader() || this.currentUser.code === this.pmVtc;
  }

  constructor(private  principleService: PrincipleService) {
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
