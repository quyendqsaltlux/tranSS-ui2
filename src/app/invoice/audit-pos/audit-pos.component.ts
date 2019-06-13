import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {ActivatedRoute, Router} from '@angular/router';
import {PoService} from '../../service/po.service';
import {PrincipleService} from '../../service/principle.service';
import {DateCellComponent} from '../../share/ag-grid/date-cell/date-cell.component';
import {PercentCellComponent} from '../../share/ag-grid/percent-cell/percent-cell.component';
import {InvoicesService} from '../../service/invoices.service';
import {AuditPoActionsCellComponent} from '../../share/ag-grid/audit-po-actions-cell/audit-po-actions-cell.component';

@Component({
  selector: 'app-audit-pos',
  templateUrl: './audit-pos.component.html',
  styleUrls: ['./audit-pos.component.scss']
})
export class AuditPosComponent implements OnInit {
  @ViewChild('template') template: TemplateRef<any>;
  columnDefs = [
    {headerName: 'Actions', colId: 'rowActions', cellRenderer: 'actionsRender', pinned: 'left', filter: false, width: 90, sortable: false, cellClass: ['text-center']},
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
  deleteId = -1;

  currentUser;

  constructor(private  poService: PoService,
              private toastr: ToastrService,
              private principleService: PrincipleService,
              private invoiceService: InvoicesService,
              private route: Router,
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
      resizable: true,
      suppressMenu: true,
      filter: 'agTextColumnFilter',
      floatingFilterComponentParams: {suppressFilterButton: true},
      filterParams: {newRowsAction: 'keep'},
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
      actionsRender: AuditPoActionsCellComponent,
      dateRender: DateCellComponent,
      percentRender: PercentCellComponent,
    };
  }

  goToInvoiceForm(index) {
    const resourceCode = this.modelList[index].candidateCode;
    const invoiceId = this.modelList[index].invoiceId;
    const company = this.modelList[index].company;
    const external = this.modelList[index].resourceName;
    this.route.navigate(['/invoices/' + resourceCode + '/' + external + '/' + company + '/form/' + invoiceId]);
  }

  getModelList() {
    this.invoiceService.search().subscribe((resp => {
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

  generateInvoices() {
    this.invoiceService.generateInvoices().subscribe((resp) => {
      this.toastr.success('Generate invoices successfully!');
    }, error2 => this.toastr.error('Fail to generate!'));
  }

}
