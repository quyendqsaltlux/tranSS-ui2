import {Component, OnInit} from '@angular/core';
import {ProjectAssignmentService} from '../../service/project-assignment.service';
import {DateCellComponent} from '../../share/ag-grid/date-cell/date-cell.component';
import {ResourceActionsCellComponent} from '../../share/ag-grid/resource-actions-cell/resource-actions-cell.component';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-project-doing',
  templateUrl: './project-doing.component.html',
  styleUrls: ['./project-doing.component.scss']
})
export class ProjectDoingComponent implements OnInit {
  candidateId = null;
  title;
  modelList = [];

  columnDefs = [
    {headerName: 'Project Code', field: 'projectCode', pinned: 'left', width: 150},
    {headerName: 'Contents', field: 'project.contents', width: 200},
    {headerName: 'Field', field: 'project.field'},
    {headerName: 'Client', field: 'project.client'},
    {headerName: 'Source', field: 'source', width: 70},
    {headerName: 'Target', field: 'target', width: 70},
    {headerName: 'Task', field: 'task'},
    {headerName: 'Total', field: 'total', type: 'numericColumn'},
    {headerName: 'HO', field: 'ho', width: 160, type: 'dateColumn'},
    {headerName: 'HB', field: 'hb', width: 160, type: 'dateColumn'},
    {headerName: 'Progress', field: 'progress'},
  ];
  /*AG_GRID*/
  gridApi;
  gridColumnApi;
  defaultColDef;
  columnTypes;
  context;
  frameworkComponents;
  sortingOrder;

  constructor(public bsModalRef: BsModalRef,
              private  assignmentService: ProjectAssignmentService) {
  }

  ngOnInit() {
    this.initTable();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getModelList();
  }

  initTable() {
    this.defaultColDef = {
      width: 120,
      editable: false,
      enableBrowserTooltips: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton: true},
      filterParams: {newRowsAction: 'keep'},
      sortable: true,
    };
    this.columnTypes = {
      numericColumn: {filter: 'agNumberColumnFilter'},
      dateColumn: {
        filter: 'agDateColumnFilter',
        filterParams: {
          newRowsAction: 'keep',
          comparator(filterLocalDateAtMidnight, cellValue) {
            const dateParts = cellValue.split('/');
            const day = Number(dateParts[2]);
            const month = Number(dateParts[1]) - 1;
            const year = Number(dateParts[0]);
            const cellDate = new Date(day, month, year);
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            } else {
              return 0;
            }
          }
        }
      }
    };
    this.sortingOrder = ['desc', 'asc'];
    this.context = {componentParent: this};
    this.frameworkComponents = {
      actionRender: ResourceActionsCellComponent,
      dateRender: DateCellComponent,
    };
  }

  getModelList() {
    this.assignmentService.getListByCandidate(this.candidateId).subscribe((resp => {
      if (!resp || !resp.body) {
        this.modelList = [];
        return;
      }
      this.modelList = resp.body;
      console.log(this.modelList);
    }));
  }

}
