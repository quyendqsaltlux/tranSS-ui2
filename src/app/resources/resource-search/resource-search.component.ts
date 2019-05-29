import {Component, OnInit} from '@angular/core';
import {separateFiltersFromGrid} from '../../util/http-util';
import {CandidateActionsColRendererComponent} from '../../share/ag-grid/candidate-actions-col-renderer.component';
import {Router} from '@angular/router';
import {DateCellComponent} from '../../share/ag-grid/date-cell/date-cell.component';
import {CandidateAbilityService} from '../../service/candidate-ability.service';
import {SortParam} from '../../model/SortParam';

@Component({
  selector: 'app-resource-search',
  templateUrl: './resource-search.component.html',
  styleUrls: ['./resource-search.component.scss']
})
export class ResourceSearchComponent implements OnInit {
  JOIN_FILTER_COLS = ['candidate.code', 'candidate.grade',
    'candidate.name', 'candidate.majorField',
    'candidate.email', 'candidate.mobile', 'candidate.catTool',
    'candidate.messenger', 'candidate.socialpages',
    'candidate.personalId', 'candidate.gender', 'candidate.dateOfBirth',
    'candidate.country', 'candidate.address'];
  columnDefs = [
    {headerName: 'Actions', colId: 'rowActions', cellRenderer: 'actionRender', pinned: 'left', filter: false, width: 90, sortable: false},
    {headerName: 'Code', field: 'candidate.code', pinned: 'left', width: 100},
    {headerName: 'Grade', field: 'candidate.grade', pinned: 'left', width: 70},
    {headerName: 'name', field: 'candidate.name', pinned: 'left', width: 150},
    {headerName: 'majorField', field: 'candidate.majorField', pinned: 'left', cellClass: ['wrap-text'], autoHeight: true, width: 250},
    {headerName: 'Project Type', field: 'projectType'},
    {headerName: 'Source', field: 'sourceLanguage', width: 70},
    {headerName: 'Target', field: 'targetLanguage', width: 70},
    {headerName: 'Task', field: 'task'},
    {headerName: 'Rate', field: 'rate', width: 70},
    {headerName: 'Rate (word/char)', field: 'rateUnit'},
    {headerName: 'Rate Hour', field: 'rate2', width: 80},
    {headerName: '(hour)', field: 'rate2unit, width: 50'},
    {headerName: 'Currency', field: 'currency', width: 80},
    {headerName: 'minimumCharge', field: 'minimumCharge', type: 'numericColumn'},
    {headerName: 'CAT Tool', field: 'candidate.catTool'},
    {headerName: 'Email', field: 'candidate.email', width: 250},
    {headerName: 'Mobile', field: 'candidate.mobile'},
    {headerName: 'Messenger', field: 'candidate.messenger'},
    {headerName: 'Social Pages', field: 'candidate.socialpages'},
    {headerName: 'Personal Id', field: 'candidate.personalId'},
    {headerName: 'Gender', field: 'candidate.gender'},
    {headerName: 'DOB', field: 'candidate.dateOfBirth', type: 'dateColumn', width: 170, cellRenderer: 'dateRender', cellRendererParams: {renderField: 'dateOfBirth'}},
    {headerName: 'Daily Capacity', field: 'dailyCapacity'},
    {headerName: 'Country', field: 'candidate.country'},
    {headerName: 'Updated At', field: 'updatedAt', type: 'dateColumn', width: 170, filter: false, cellRenderer: 'dateRender', cellRendererParams: {renderField: 'updatedAt'}},
    {headerName: 'Address', field: 'candidate.address', width: 250},
  ];
  /*AG_GRID*/
  gridApi;
  gridColumnApi;
  defaultColDef;
  columnTypes;
  context;
  frameworkComponents;
  sortingOrder;

  modelList = [];
  keyWord: string;
  page = 1;
  size = 100;
  numPages = 0;
  totalItems = 0;

  filter = [];
  joinFilter = [];
  sorts: SortParam[] = [];

  constructor(private  abilityService: CandidateAbilityService,
              public route: Router) {
  }

  ngOnInit() {
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
    this.sorts = [...this.buildSortParams(sortState)];
    this.getModelList();
  }

  buildSortParams(agSortConfigs: any[]) {
    if (!agSortConfigs) {
      return [];
    }
    return agSortConfigs.map(value => {
      return new SortParam(value.colId, value.sort);
    });
  }

  initTable() {
    this.defaultColDef = {
      width: 120,
      editable: false,
      resizable: true,
      filter: 'agTextColumnFilter',
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton: true},
      filterParams: {newRowsAction: 'keep'},
      sortable: true
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
    this.joinFilter = [...separatedFilter.join];
    this.getModelList();
  }

  gotoEditForm(index) {
    this.route.navigate(['/resources/edit/' + this.modelList[index].id]);
  }

  onViewHistory(index) {
    this.route.navigate(['/resources/' + this.modelList[index].id + '/project-history']);
  }

  onViewRates(index) {
    this.route.navigate(['/resources/' + this.modelList[index].id + '/abilities']);
  }

  getModelList() {
    this.abilityService.search(this.page, this.size, this.keyWord, this.sorts,
      this.filter, this.joinFilter
    ).subscribe((resp => {
      if (!resp || !resp.body) {
        this.modelList = [];
        this.totalItems = 0;
        this.numPages = 0;
        return;
      }
      this.modelList = resp.body.content;
      this.totalItems = resp.body.totalElements;
      this.numPages = resp.body.totalPages;
    }));
  }

  onClickSearch() {
    this.page = 1;
    this.getModelList();
  }

  onFilter() {
    this.page = 1;
    this.getModelList();
  }

  pageChanged(event) {
    setTimeout((e) => {
      this.getModelList();
    }, 0);
  }

}
