import {ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {EvaluationService} from '../../service/evaluation.service';
import {DateCellComponent} from '../../share/ag-grid/date-cell/date-cell.component';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {combineLatest, Subscription} from 'rxjs/index';
import {GeneralCommentComponent} from '../general-comment/general-comment.component';
import {separateFiltersFromGrid} from '../../util/http-util';
import {EvaluationActionsCellComponent} from '../../share/ag-grid/evaluation-actions-cell/evaluation-actions-cell.component';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-general-comment-list',
  templateUrl: './general-comment-list.component.html',
  styleUrls: ['./general-comment-list.component.scss']
})
export class GeneralCommentListComponent implements OnInit {
  @ViewChild('template') template: TemplateRef<any>;
  bsModalRef: BsModalRef;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  @Input() candidateId;
  JOIN_FILTER_COLS = [];
  columnDefs = [
    {headerName: 'Actions', colId: 'rowActions', pinned: 'left', filter: false, width: 70, cellRenderer: 'actionsRenderer'},
    {headerName: 'date', field: 'date', type: 'dateColumn', width: 170, cellRenderer: 'dateRender', cellRendererParams: {renderField: 'date'}},
    {headerName: 'Evaluator', field: 'evaluator'},
    {headerName: 'Comment', field: 'comment', width: 1000, cellClass: ['wrap-text'], autoHeight: true},

  ];
  /*AG_GRID*/
  gridApi;
  gridColumnApi;
  defaultColDef;
  columnTypes;
  context;
  frameworkComponents;
  domLayout;
  sortingOrder;

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

  rootFilter = [];
  joinFilter = [];
  deleteId = -1;

  constructor(private evaluationService: EvaluationService,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private changeDetection: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.initTable();
  }

  getModelList() {
    this.evaluationService.searchGeneralComment(this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order, this.rootFilter, [], this.candidateId)
      .subscribe((resp) => {
        this.modelList = [...resp.body.content];
        this.totalItems = resp.body.totalElements;
        this.numPages = resp.body.totalPages;
      });
  }

  initTable() {
    this.defaultColDef = {
      width: 100,
      editable: false,
      enableBrowserTooltips: true,
      resizable: true,
      filter: 'agTextColumnFilter',
      floatingFilter: true,
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
      actionsRenderer: EvaluationActionsCellComponent,
      dateRender: DateCellComponent,
    };
    this.domLayout = 'autoHeight';
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

  onGridFilterChange(event) {
    const filters = this.gridApi != null ? this.gridApi.getFilterModel() : null;
    const separatedFilter = separateFiltersFromGrid(filters, this.JOIN_FILTER_COLS);
    this.rootFilter = [...separatedFilter.root];
    this.joinFilter = [...separatedFilter.join];
    this.getModelList();
  }

  onEdit(index) {
    this.openNewGeneralCommentModal(this.modelList[index]);
  }

  onDelete(index) {
    this.openModal(this.template, this.modelList[index].id);
  }

  openNewGeneralCommentModal(data?) {
    const _combine = combineLatest(
      this.modalService.onHide,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
      })
    );
    this.subscriptions.push(
      this.modalService.onHidden.subscribe((reason: string) => {
        console.log(reason);
        this.onModalClose(this.bsModalRef.content);
        this.unsubscribe();
      })
    );

    this.subscriptions.push(_combine);

    const initialState = {
      title: 'General comment',
      candidateId: this.candidateId,
      model: data == null ? {} : data,
    };
    this.bsModalRef = this.modalService.show(GeneralCommentComponent, {initialState} as ModalOptions);
    this.bsModalRef.content.closeBtnName = 'Cancel';
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  onModalClose(modalContent) {
    if (modalContent.model.id) {
      this.getModelList();
    }
  }

  openModal(template: TemplateRef<any>, id) {
    this.deleteId = id;
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'} as ModalOptions);
  }

  confirmDelete(): void {
    this.modalRef.hide();
    if (this.deleteId < 0) {
      return;
    }
    this.evaluationService.deleteGeneralComment(this.deleteId).subscribe((resp) => {
        this.toastr.success('Delete successfully!');
        this.getModelList();
      },
      (error1 => {
        this.toastr.error('Fail to delete!');
      }));
  }

  declineDelete(): void {
    this.modalRef.hide();
  }
}
