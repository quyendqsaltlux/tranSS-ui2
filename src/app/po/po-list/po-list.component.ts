import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {separateFiltersFromGridAssignment} from '../../util/http-util';
import {EQUAL} from '../../AppConstant';
import {Router} from '@angular/router';
import {PoService} from '../../service/po.service';
import {PrincipleService} from '../../service/principle.service';
import {DateCellComponent} from '../../share/ag-grid/date-cell/date-cell.component';
import {PoActionsCellComponent} from '../../share/ag-grid/po-actions-cell/po-actions-cell.component';
import {PercentCellComponent} from '../../share/ag-grid/percent-cell/percent-cell.component';

@Component({
  selector: 'app-po-list',
  templateUrl: './po-list.component.html',
  styleUrls: ['./po-list.component.scss']
})
export class PoListComponent implements OnInit {
  @ViewChild('template') template: TemplateRef<any>;
  PO_FILTERS = ['poNo', 'currency'];
  PROJECT_FILTERS = ['projectCode'];
  CANDIDATE_FILTER = ['candidateCode', 'resourceName'];
  columnDefs = [
    {headerName: 'Actions', colId: 'rowActions', cellRenderer: 'actionsRender', pinned: 'left', filter: false, width: 90, sortable: false, cellClass: ['text-center']},
    {headerName: 'Assignment Id', field: 'id', type: 'numericColumn'},
    {headerName: 'PO No', field: 'poNo'},
    {headerName: 'Project Code', field: 'projectCode'},
    {headerName: 'Resource Id', field: 'candidateCode'},
    {headerName: 'Resource Name', field: 'resourceName', width: 150},
    {headerName: 'Task', field: 'task'},
    {headerName: 'Source', field: 'source'},
    {headerName: 'Target', field: 'target'},
    {headerName: 'Unit Price', field: 'unitPrice'},
    {headerName: 'Order Date', field: 'ho', type: 'dateColumn', width: 160, cellRenderer: 'dateRender', cellRendererParams: {renderField: 'ho'}},
    {headerName: 'Due Date', field: 'hb', type: 'dateColumn', width: 160, cellRenderer: 'dateRender', cellRendererParams: {renderField: 'hb'}},
    {headerName: 'Total', field: 'total', type: 'numericColumn'},
    {headerName: 'Currency', field: 'currency'},
    {headerName: 'Net/Hour', field: 'netOrHour'},
    {headerName: 'Rep.', field: 'reprep', type: 'numericColumn'},
    {headerName: '100%', field: 'rep100', type: 'numericColumn'},
    {headerName: '99~95%', field: 'rep99_95', type: 'numericColumn'},
    {headerName: '94-85%', field: 'rep94_85', type: 'numericColumn'},
    {headerName: '84-75%', field: 'rep84_75', type: 'numericColumn'},
    {headerName: 'New/Hour', field: 'repnoMatch', type: 'numericColumn'},
    {headerName: 'Total Rep', field: 'totalRep', type: 'numericColumn'},
    {headerName: 'Wf Rep.', field: 'wrep', type: 'numericColumn', cellRenderer: 'percentRender', cellRendererParams: {renderField: 'wrep'}},
    {headerName: 'Wf100', field: 'w100', type: 'numericColumn', cellRenderer: 'percentRender', cellRendererParams: {renderField: 'w100'}},
    {headerName: 'Wf99~95', field: 'w99_95', type: 'numericColumn', cellRenderer: 'percentRender', cellRendererParams: {renderField: 'w99_95'}},
    {headerName: 'Wf94~85', field: 'w94_85', type: 'numericColumn', cellRenderer: 'percentRender', cellRendererParams: {renderField: 'w94_85'}},
    {headerName: 'Wf84~75', field: 'w84_75', type: 'numericColumn', cellRenderer: 'percentRender', cellRendererParams: {renderField: 'w84_75'}},
    {headerName: 'Wf New', field: 'wnoMatch', type: 'numericColumn', cellRenderer: 'percentRender', cellRendererParams: {renderField: 'wnoMatch'}},
    {headerName: 'Updated At', width: 160, field: 'updatedAt', type: 'dateColumn', cellRenderer: 'dateRender', cellRendererParams: {renderField: 'updatedAt'}},
  ];
  /*AG_GRID*/
  gridApi;
  gridColumnApi;
  defaultColDef;
  columnTypes;
  context;
  frameworkComponents;
  sortingOrder;

  activedTab = 'ON_GOING';
  ignoreFilter = true;
  modalRef: BsModalRef;
  modelList = [];
  keyWord: string;
  page = 1;
  size = 100;
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
  poFilter = [];
  projectFilter = [];
  candidateFilter = [];
  deleteId = -1;

  currentUser;
  any;

  constructor(private  poService: PoService,
              private toastr: ToastrService,
              private principleService: PrincipleService,
              public route: Router,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.currentUser = this.principleService.getUserInfo();
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
      numericColumn: {filter: 'agnumericColumnFilter'},
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
      actionsRender: PoActionsCellComponent,
      dateRender: DateCellComponent,
      percentRender: PercentCellComponent,
    };
  }

  onDelete(index) {
    this.openModal(this.template, this.modelList[index].id);
  }

  onEdit(index) {
    this.route.navigate(['/projects/edit/' + this.modelList[index].projectId]);
  }

  /**
   * Change value of progress status like active tab
   */
  injectTabFilter() {
    const tabFilter = this.projectFilter.find((item) => item.field === 'progressStatus');
    if (tabFilter) {
      tabFilter.value = this.activedTab;
    } else {
      this.projectFilter.push({operation: EQUAL, value: this.activedTab, field: 'progressStatus'});
    }
  }

  getModelList() {
    this.injectTabFilter();
    this.poService.search(this.currentUser.code, this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order,
      this.filter, this.poFilter, this.projectFilter, this.candidateFilter)
      .subscribe((resp => {
        if (!resp || !resp.body) {
          this.modelList = [];
          this.totalItems = 0;
          this.numPages = 0;
          return;
        }
        this.modelList = [...resp.body.content];
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

  pageChanged() {
    setTimeout(() => {
      this.getModelList();
    }, 0);
  }

  onGridFilterChange(event) {
    const filters = this.gridApi != null ? this.gridApi.getFilterModel() : null;
    const separatedFilter = separateFiltersFromGridAssignment(filters, this.PO_FILTERS, this.PROJECT_FILTERS, this.CANDIDATE_FILTER);
    this.filter = [...separatedFilter.root];
    this.poFilter = [...separatedFilter.po];
    this.projectFilter = [...separatedFilter.project];
    this.candidateFilter = [...separatedFilter.candidate];
    this.getModelList();
  }

  onGridSortChanged(event) {
    const sortState = this.gridApi.getSortModel();
    this.sortConfig.order = sortState[0].sort;
    this.sortConfig.field = sortState[0].colId;
    this.getModelList();
  }

  onClickDelete(index) {
    this.openModal(this.template, this.modelList[index].id);
  }

  openModal(template: TemplateRef<any>, id) {
    this.deleteId = id;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'} as ModalOptions);
  }

  confirm(): void {
    this.modalRef.hide();
    if (this.deleteId < 0) {
      return;
    }
    this.poService.deleteById(this.deleteId).subscribe((resp) => {
        this.toastr.success('Delete successfully!');
        this.onFilter();
      },
      (error1 => {
        this.toastr.error('Fail to delete!');
      }));
  }

  decline(): void {
    this.modalRef.hide();
  }

  onClickTab(tab) {
    if (tab !== this.activedTab) {
      this.activedTab = tab;
      this.getModelList();
    }
  }
}
