import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {separateFiltersFromGridAssignment} from '../../util/http-util';
import {Router} from '@angular/router';
import {PrincipleService} from '../../service/principle.service';
import {DateCellComponent} from '../../share/ag-grid/date-cell/date-cell.component';
import {PercentCellComponent} from '../../share/ag-grid/percent-cell/percent-cell.component';
import {InvoicesService} from '../../service/invoices.service';
import {InvoiceActionsCellComponent} from '../../share/ag-grid/invoice-actions-cell/invoice-actions-cell.component';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  @Output() invoiceDeleted: EventEmitter<any> = new EventEmitter();
  @ViewChild('template') template: TemplateRef<any>;
  @ViewChild('template2') template2: TemplateRef<any>;
  PO_FILTERS = ['poNo', 'currency'];
  PROJECT_FILTERS = ['projectCode'];
  CANDIDATE_FILTER = ['candidateCode', 'resourceName'];
  columnDefs = [
    {headerName: 'Actions', colId: 'rowActions', cellRenderer: 'actionsRender', pinned: 'left', filter: false, width: 90, sortable: false, cellClass: ['text-center']},
    {headerName: 'Resource Name', field: 'resourceName'},
    {headerName: 'Address', field: 'address'},
    {headerName: 'Mobile', field: 'mobile'},
    {headerName: 'Email', field: 'email'},
    {headerName: 'Bank Name', field: 'bankName'},
    {headerName: 'Account Number', field: 'account'},
    {headerName: 'Depositor', field: 'depositor'},
    {headerName: 'SwiftCode', field: 'swiftCode'},
    {headerName: 'PayPal', field: 'payPal'},
    {headerName: 'Total', field: 'total', type: 'numericColumn', width: 100},
    {headerName: 'Currency', field: 'currency', width: 100},
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

  activedTab = 'NOT_CONFIRMED';
  ignoreFilter = true;
  modalRef: BsModalRef;
  modelList = [];
  keyWord: string;
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
  confirmId = -1;
  confirmValue = null;

  currentUser;

  constructor(private toastr: ToastrService,
              private principleService: PrincipleService,
              private invoiceService: InvoicesService,
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
      width: 250,
      editable: false,
      resizable: true,
      suppressMenu: true,
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
      actionsRender: InvoiceActionsCellComponent,
      dateRender: DateCellComponent,
      percentRender: PercentCellComponent,
    };
  }

  onClickTab(tab) {
    if (tab !== this.activedTab) {
      this.activedTab = tab;
      this.getModelList();
    }
  }

  onMarkConfirm(index) {
    this.openModalConfirm(this.template2, this.modelList[index].id, true);
  }

  onMarkUnConfirm(index) {
    this.openModalConfirm(this.template2, this.modelList[index].id, false);
  }

  onDelete(index) {
    this.openModal(this.template, this.modelList[index].id);
  }

  onEdit(index) {
    const invoice = this.modelList[index];
    const resourceCode = invoice.candidate ? invoice.candidate.code : null;
    const company = invoice.purchaseOrders[0].company;
    const external = this.modelList[index].resourceName;
    this.route.navigate(['/invoices/' + resourceCode + '/' + external + '/' + company + '/form/' + invoice.id]);
  }

  getModelList() {
    this.invoiceService.getInvoicesByStatus(this.activedTab === 'CONFIRMED').subscribe((resp => {
      if (!resp || !resp.body) {
        this.modelList = [];
        return;
      }
      this.modelList = [...resp.body];
      this.ignoreFilter = false;
    }));
  }

  onClickSearch() {
    this.getModelList();
  }

  onFilter() {
    if (this.ignoreFilter) {
      return;
    }
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
    this.invoiceService.deleteById(this.deleteId).subscribe((resp) => {
        this.toastr.success('Delete successfully!');
        this.onFilter();
        this.invoiceDeleted.emit(true);
      },
      (error1 => {
        this.toastr.error('Fail to delete!');
      }));
  }

  decline(): void {
    this.modalRef.hide();
  }

  openModalConfirm(template: TemplateRef<any>, id, value) {
    this.confirmId = id;
    this.confirmValue = value;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'} as ModalOptions);
  }

  confirmInvoice(): void {
    this.modalRef.hide();
    if (this.confirmId < 0) {
      return;
    }

    this.invoiceService.markConfirm(this.confirmId, this.confirmValue).subscribe((resp) => {
      if (this.confirmValue === true) {
        this.toastr.success('Confirmed successfully!');
      } else {
        this.toastr.success('Un-confirmed successfully!');
      }
      this.getModelList();
    }, error2 => this.toastr.error('Fail to confirm'));
  }

  declineInvoice(): void {
    this.modalRef.hide();
  }
}
