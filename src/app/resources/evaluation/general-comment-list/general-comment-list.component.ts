import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {EvaluationService} from '../../../service/evaluation.service';
import {ActionsColRendererComponent} from '../../../share/ag-grid/actions-col-renderer.component';
import {DateCellComponent} from '../../../share/ag-grid/date-cell/date-cell.component';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {combineLatest, Subscription} from 'rxjs/index';
import {GeneralCommentComponent} from '../general-comment/general-comment.component';
import {separateFiltersFromGrid} from '../../../util/http-util';

@Component({
  selector: 'app-general-comment-list',
  templateUrl: './general-comment-list.component.html',
  styleUrls: ['./general-comment-list.component.scss']
})
export class GeneralCommentListComponent implements OnInit {
  bsModalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  @Input() candidateId;
  JOIN_FILTER_COLS = [];
  columnDefs = [
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

  constructor(private evaluationService: EvaluationService,
              private modalService: BsModalService,
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
      childMessageRenderer: ActionsColRendererComponent,
      dateRender: DateCellComponent,
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
    console.log(filters);
    const separatedFilter = separateFiltersFromGrid(filters, this.JOIN_FILTER_COLS);
    this.rootFilter = [...separatedFilter.root];
    this.joinFilter = [...separatedFilter.join];
    this.getModelList();
  }

  openNewGeneralCommentModal() {
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
      candidateId: this.candidateId
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
}
