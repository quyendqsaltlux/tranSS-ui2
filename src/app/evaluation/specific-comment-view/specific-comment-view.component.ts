import {ChangeDetectorRef, Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {EvaluationService} from '../../service/evaluation.service';
import {separateFiltersFromGrid} from '../../util/http-util';
import {ActionsColRendererComponent} from '../../share/ag-grid/actions-col-renderer.component';
import {EvaluationActionsCellComponent} from '../../share/ag-grid/evaluation-actions-cell/evaluation-actions-cell.component';
import {combineLatest, Subscription} from 'rxjs/index';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {SpecificCommentComponent} from '../specific-comment/specific-comment.component';

@Component({
  selector: 'app-specific-comment-view',
  templateUrl: './specific-comment-view.component.html',
  styleUrls: ['./specific-comment-view.component.scss']
})
export class SpecificCommentViewComponent implements OnInit {
  @ViewChild('template') template: TemplateRef<any>;
  bsModalRef: BsModalRef;
  modalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  @Input() candidateId;
  JOIN_FILTER_COLS = ['assignment.project.code', 'assignment.project.totalVolume', 'assignment.project.field', 'assignment.project.contents'];
  columnDefs = [
    {headerName: 'Actions', colId: 'rowActions', pinned: 'left', filter: false, width: 70, cellRenderer: 'actionsRenderer'},
    {headerName: 'Project', field: 'assignment.project.code'},
    {headerName: 'volume', field: 'assignment.project.totalVolume'},
    {headerName: 'Field', field: 'assignment.project.field'},
    {headerName: 'Document', field: 'assignment.project.contents', width: 250},
    {headerName: 'Level of difficulty', field: 'level', width: 200},
    {headerName: 'Comment', field: 'comment', width: 500, autoHeight: true, cellClass: ['wrap-text']},
    {headerName: 'Evaluator', field: 'evaluator'},
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

  initTable() {
    this.defaultColDef = {
      width: 100,
      editable: false,
      enableBrowserTooltips: true,
      resizable: true,
      // filter: 'agTextColumnFilter',
      filter: false,
      // floatingFilter: false,
      suppressMenu: true,
      // floatingFilterComponentParams: {suppressFilterButton: true},
      // filterParams: {newRowsAction: 'keep'},
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
      childMessageRenderer: ActionsColRendererComponent
    };
    this.domLayout = 'autoHeight';
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getModelList();
  }

  onGridFilterChange(event) {
    const filters = this.gridApi != null ? this.gridApi.getFilterModel() : null;
    const separatedFilter = separateFiltersFromGrid(filters, this.JOIN_FILTER_COLS);
    this.rootFilter = [...separatedFilter.root];
    this.joinFilter = [...separatedFilter.join];
    this.getModelList();
  }

  onGridSortChanged(event) {
    const sortState = this.gridApi.getSortModel();
    this.sortConfig.order = sortState[0].sort;
    this.sortConfig.field = sortState[0].colId;
    this.getModelList();
  }

  getModelList() {
    this.evaluationService.searchSpecificComment(this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order, this.rootFilter, this.joinFilter, this.candidateId)
      .subscribe((resp) => {
        this.modelList = [...resp.body.content];
        this.totalItems = resp.body.totalElements;
        this.numPages = resp.body.totalPages;
      });
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
        this.onModalClose(this.bsModalRef.content);
        this.unsubscribe();
      })
    );

    this.subscriptions.push(_combine);

    const comment = {...data};
    delete comment.assignment;
    const initialState = {
      title: 'Specific comment',
      assignmentId: data.assignment.id,
      model: comment,
    };
    this.bsModalRef = this.modalService.show(SpecificCommentComponent, {initialState} as ModalOptions);
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
    this.evaluationService.deleteSpecificComment(this.deleteId).subscribe((resp) => {
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
