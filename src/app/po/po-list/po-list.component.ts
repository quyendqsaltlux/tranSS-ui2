import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {separateFiltersFromGrid} from '../../util/http-util';
import {EQUAL} from '../../AppConstant';
import {ActionsColRendererComponent} from '../../share/ag-grid/actions-col-renderer.component';
import {Router} from '@angular/router';
import {PoService} from '../../service/po.service';
import {PrincipleService} from '../../service/principle.service';
import {DateCellComponent} from '../../share/ag-grid/date-cell/date-cell.component';

@Component({
  selector: 'app-po-list',
  templateUrl: './po-list.component.html',
  styleUrls: ['./po-list.component.scss']
})
export class PoListComponent implements OnInit {
  @ViewChild('template') template: TemplateRef<any>;
  JOIN_FILTER_COLS = ['pm.code'];
  columnDefs = [
    {headerName: 'Actions', colId: 'rowActions', cellRenderer: 'actionsRender', pinned: 'left', filter: false, width: 90, sortable: false, cellClass: ['text-center']},
    {headerName: 'Project Code', field: 'projectCode'},
    {headerName: 'Resource Id', field: 'candidateCode'},
    {headerName: 'Resource Name', field: 'resourceName'},
    {headerName: 'Task', field: 'task'},
    {headerName: 'Source', field: 'source'},
    {headerName: 'Target', field: 'target'},
    {headerName: 'Unit Price', field: 'unitPrice'},
    {headerName: 'Order Date', field: 'ho', type: 'dateColumn', width: 160, cellRenderer: 'dateRender', cellRendererParams: {renderField: 'ho'}},
    {headerName: 'Due Date', field: 'hb', type: 'dateColumn', width: 160, cellRenderer: 'dateRender', cellRendererParams: {renderField: 'hb'}},
    {headerName: 'Total', field: 'total'},
    {headerName: 'Currency', field: 'currency'},
    {headerName: 'Net/Hour', field: 'netOrHour'},
    {headerName: 'Rep.', field: 'reprep'},
    {headerName: '100%', field: 'rep100'},
    {headerName: '99~95%', field: 'rep99_95'},
    {headerName: '94-85%', field: 'rep94_85'},
    {headerName: '84-75%', field: 'rep84_75'},
    {headerName: 'New/Hour', field: 'repnoMatch'},
    {headerName: 'Total Rep', field: 'totalRep'},
    {headerName: 'Wf Rep.', field: 'wrep'},
    {headerName: 'Wf100', field: 'w100'},
    {headerName: 'Wf99~95', field: 'w99_95'},
    {headerName: 'Wf94~85', field: 'w94_85'},
    {headerName: 'Wf84~75', field: 'w84_75'},
    {headerName: 'Wf New', field: 'wnoMatch'},
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
  pmFilter = [];
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
      actionsRender: ActionsColRendererComponent,
      dateRender: DateCellComponent,
    };
  }

  gotoEditForm(index) {
    this.route.navigate(['/projects/edit/' + this.modelList[index].id]);
  }

  /**
   * Change value of progress status like active tab
   */
  injectTabFilter() {
    const tabFilter = this.filter.find((item) => item.field === 'progressStatus');
    if (tabFilter) {
      tabFilter.value = this.activedTab;
    } else {
      this.filter.push({operation: EQUAL, value: this.activedTab, field: 'progressStatus'});
    }
  }

  getModelList() {
    this.injectTabFilter();
    this.poService.search(this.currentUser.id, this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order,
      this.filter, this.pmFilter)
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
    const separatedFilter = separateFiltersFromGrid(filters, this.JOIN_FILTER_COLS);
    this.filter = [...separatedFilter.root];
    this.pmFilter = [...separatedFilter.join];
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

  // confirm(): void {
  //   this.modalRef.hide();
  //   if (this.deleteId < 0) {
  //     return;
  //   }
  //   this.poService.deleteById(this.deleteId).subscribe((resp) => {
  //       this.toastr.success('Delete successfully!');
  //       this.onFilter();
  //     },
  //     (error1 => {
  //       this.toastr.error('Fail to delete!');
  //     }));
  // }

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
