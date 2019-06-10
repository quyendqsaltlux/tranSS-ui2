import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {separateFiltersFromGrid} from '../../util/http-util';
import {ActionsColRendererComponent} from '../../share/ag-grid/actions-col-renderer.component';
import {Router} from '@angular/router';
import {TestWaitingService} from '../../service/test-waiting.service';
import {InternalCheckCellComponent} from '../../share/ag-grid/internal-check-cell/internal-check-cell.component';
import {EQUAL} from '../../AppConstant';

@Component({
  selector: 'app-test-waiting-list',
  templateUrl: './test-waiting-list.component.html',
  styleUrls: ['./test-waiting-list.component.scss']
})
export class TestWaitingListComponent implements OnInit {
  @ViewChild('template') template: TemplateRef<any>;
  JOIN_FILTER_COLS = [];
  columnDefs = [
    {headerName: 'Actions', colId: 'rowActions', cellRenderer: 'actionRender', pinned: 'left', filter: false, width: 90, sortable: false, cellClass: ['text-center']},
    {headerName: 'Code', field: 'code'},
    {headerName: 'Source', field: 'source'},
    {headerName: 'Target', field: 'target'},
    {headerName: 'Name', field: 'name'},
    {headerName: 'Contact', field: 'contact', width: 200},
    {headerName: 'TestContents', field: 'testContents', width: 200},
    {headerName: 'Tool', field: 'tool'},
    {headerName: 'TestInvitation', field: 'testInvitation'},
    {headerName: 'HB Receipt', field: 'hbReceipt', width: 160, type: 'dateColumn'},
    {headerName: 'HB Files', field: 'hbFiles'},
    {headerName: 'Internal Check', field: 'internalCheck', cellClass: ['lowercase'], cellRenderer: 'internalCheckRender', cellRendererParams: {renderField: 'internalCheck'}},
    {headerName: 'Test Evaluation', field: 'testEvaluation', cellClass: ['lowercase']},
    {headerName: 'Comments', field: 'comments'},
    {headerName: 'Other Note', field: 'otherNote', width: 300},
  ];
  /*AG_GRID*/
  gridApi;
  gridColumnApi;
  defaultColDef;
  columnTypes;
  context;
  frameworkComponents;
  sortingOrder;

  activedTab = 'SHORT_LIST';
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
  deleteId = -1;

  constructor(private  testWaitingService: TestWaitingService,
              private toastr: ToastrService,
              public route: Router,
              private modalService: BsModalService) {
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
      actionRender: ActionsColRendererComponent,
      internalCheckRender: InternalCheckCellComponent
    };
  }

  gotoEditForm(index) {
    this.route.navigate(['/resources/test-waiting/edit/' + this.modelList[index].id]);
  }

  /**
   * Change value of progress status like active tab
   */
  injectTabFilter() {
    const tabFilter = this.filter.find((item) => item.field === 'isShortList');
    if (tabFilter) {
      tabFilter.value = 'SHORT_LIST' === this.activedTab ? 1 : 0;
    } else {
      this.filter.push({operation: EQUAL, value: 'SHORT_LIST' === this.activedTab ? 1 : 0, field: 'isShortList'});
    }
  }

  getModelList() {
    this.injectTabFilter();
    this.testWaitingService.search(this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order, this.filter)
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
    this.testWaitingService.deleteById(this.deleteId).subscribe((resp) => {
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
