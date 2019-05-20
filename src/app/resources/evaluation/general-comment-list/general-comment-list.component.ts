import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {EvaluationService} from '../../../service/evaluation.service';
import {ActionsColRendererComponent} from '../../../share/ag-grid/actions-col-renderer.component';
import {DateCellComponent} from '../../../share/ag-grid/date-cell/date-cell.component';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {combineLatest, Subscription} from 'rxjs/index';
import {GeneralCommentComponent} from '../general-comment/general-comment.component';

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
    {headerName: 'Comment', field: 'comment', width: 350},

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
  }

  getModelList() {
    this.evaluationService.searchGeneralComment(this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order, [], [], this.candidateId)
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
      // filter: 'agTextColumnFilter',
      filter: false,
      floatingFilter: false,
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
      childMessageRenderer: ActionsColRendererComponent,
      dateRender: DateCellComponent,
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getModelList();
  }

  openNewGeneralCommentModal(isKoreaPM, _title) {
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
        this.onModalClose(this.bsModalRef.content, isKoreaPM);
        this.unsubscribe();
      })
    );

    this.subscriptions.push(_combine);

    const initialState = {
      title: 'General comment',
      candidateId: this.candidateId
    };
    this.bsModalRef = this.modalService.show(GeneralCommentComponent);
    this.bsModalRef.content.closeBtnName = 'Cancel';
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  onModalClose(modalContent, isKoreaPM) {
    const selectedPM = modalContent.selectedOption;
    const isConfirmed = modalContent.isConfirmed;

  }
}
