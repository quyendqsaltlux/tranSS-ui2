import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {ProjectDoingComponent} from '../../../resources/project-doing/project-doing.component';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';

@Component({
  selector: 'app-date-cell',
  templateUrl: './resource-code-cell.component.html',
  styleUrls: ['./resource-code-cell.component.scss']
})
export class ResourceCodeCellComponent implements ICellRendererAngularComp {
  bsModalRef: BsModalRef;
  public params: any;
  value = [];

  constructor(private modalService: BsModalService) {

  }

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.data.candidate.code;
  }

  refresh(): boolean {
    return false;
  }

  findDoingProjects() {
    const initialState = {
      title: 'On-going projects',
      candidateId: this.params.data.candidate.id
    };
    this.bsModalRef = this.modalService.show(ProjectDoingComponent, {initialState, class: 'modal-xl'} as ModalOptions);
  }
}
