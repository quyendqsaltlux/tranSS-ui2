import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FILTER_TYPE_ROOT} from '../../share/my-datatable/my-datatable.component';
import {separateFiltersFromGrid} from '../../util/http-util';
import * as _ from 'lodash';
import {ProjectAssignmentService} from '../../service/project-assignment.service';
import {CandidateActionsColRendererComponent} from '../../share/ag-grid/candidate-actions-col-renderer.component';
import {DateCellComponent} from '../../share/ag-grid/date-cell/date-cell.component';

@Component({
  selector: 'app-project-history',
  templateUrl: './project-history.component.html',
  styleUrls: ['./project-history.component.scss']
})
export class ProjectHistoryComponent implements OnInit {
  candidateId = null;
  ignoreFilter = true;
  modelList = [];
  keyWord: string;
  page = 1;
  size = 10;
  numPages = 0;
  totalItems = 0;
  sortConfig: {
    field: string,
    order: string
  } = {
    field: null,
    order: null
  };
  filter = [];

  JOIN_FILTER_COLS = [];
  columnDefs = [
    {headerName: 'Project Code', field: 'projectCode', pinned: 'left', width: 100},
    {headerName: 'Contents', field: 'contents', width: 150},
    {headerName: 'Field', field: 'field'},
    {headerName: 'Client', field: 'client'},
    {headerName: 'Source', field: 'source', width: 70},
    {headerName: 'Target', field: 'target', width: 70},
    {headerName: 'Task', field: 'task'},
    {headerName: 'Total', field: 'total', type: 'numericColumn'},
  ];
  /*AG_GRID*/
  gridApi;
  gridColumnApi;
  defaultColDef;
  columnTypes;
  context;
  frameworkComponents;
  sortingOrder;

  constructor(private route: ActivatedRoute,
              private  assignmentService: ProjectAssignmentService) {
  }

  ngOnInit() {
    this.candidateId = +this.route.snapshot.paramMap.get('candidateId');
    this.initTable();
    this.getModelList();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getModelList();
  }

  onGridSortChanged(event) {
    const sortState = this.gridApi.getSortModel();
    this.sortConfig.order = sortState[0].sort;
    this.sortConfig.field = sortState[0].colId;
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
      actionRender: CandidateActionsColRendererComponent,
      dateRender: DateCellComponent,
    };
  }

  onGridFilterChange(event) {
    const filters = this.gridApi != null ? this.gridApi.getFilterModel() : null;
    const separatedFilter = separateFiltersFromGrid(filters, this.JOIN_FILTER_COLS);
    this.filter = [...separatedFilter.root];
    this.getModelList();
  }

  getModelList() {
    this.assignmentService.search(this.candidateId, this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order, this.filter, []
    )
      .subscribe((resp => {
        if (!resp || !resp.body) {
          this.modelList = [];
          this.totalItems = 0;
          this.numPages = 0;
          return;
        }
        this.modelList = resp.body.content;
        this.totalItems = resp.body.totalElements;
        this.numPages = resp.body.totalPages;

        this.ignoreFilter = false;
      }));
  }

  onClickSearch() {
    this.page = 1;
    this.getModelList();
  }

  onFilter() {
    if (this.ignoreFilter) {
      return;
    }
    this.page = 1;
    this.getModelList();
  }

  pageChanged(event) {
    setTimeout((e) => {
      this.getModelList();
    }, 0);
  }

  toggleSort(sortData) {
    this.sortConfig.field = sortData.field;
    this.sortConfig.order = sortData.order;
    this.getModelList();
  }

  onFilterChange(event) {
    this.filter = _.cloneDeep(event[FILTER_TYPE_ROOT]);
    this.onFilter();
  }
}
