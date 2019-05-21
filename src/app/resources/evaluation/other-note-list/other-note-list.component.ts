import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {EvaluationService} from '../../../service/evaluation.service';
import {ActionsColRendererComponent} from '../../../share/ag-grid/actions-col-renderer.component';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {combineLatest, Subscription} from 'rxjs/index';
import {separateFiltersFromGrid} from '../../../util/http-util';
import {OtherNoteComponent} from '../other-note/other-note.component';

@Component({
  selector: 'app-other-note-list',
  templateUrl: './other-note-list.component.html',
  styleUrls: ['./other-note-list.component.scss']
})
export class OtherNoteListComponent implements OnInit {
  bsModalRef: BsModalRef;
  subscriptions: Subscription[] = [];
  @Input() candidateId;
  JOIN_FILTER_COLS = [];
  columnDefs = [
    {headerName: 'project', field: 'project', width: 100},
    {headerName: 'target', field: 'target', cellStyle: {'white-space': 'normal'}},
    {headerName: 'corrected', field: 'corrected', cellStyle: {'white-space': 'normal'}},
    {headerName: 'comment', field: 'comment', cellStyle: {'white-space': 'normal'}},
  ];
  /*AG_GRID*/
  gridApi;
  gridColumnApi;
  defaultColDef;
  columnTypes;
  context;
  frameworkComponents;
  getRowHeight;
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
    this.evaluationService.searchOtherNote(this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order, this.rootFilter, [], this.candidateId)
      .subscribe((resp) => {
        this.modelList = [...resp.body.content];
        this.totalItems = resp.body.totalElements;
        this.numPages = resp.body.totalPages;
      });
  }

  initTable() {
    this.defaultColDef = {
      width: 500,
      autoHeight: true,
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
    this.sortingOrder = ['desc', 'asc'];
    this.context = {componentParent: this};
    this.frameworkComponents = {
      childMessageRenderer: ActionsColRendererComponent
    };
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

  openNewOtherNoteModal() {
    const _combine = combineLatest(
      this.modalService.onHide,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());
    this.subscriptions.push(this.modalService.onHide.subscribe((reason: string) => {
    }));
    this.subscriptions.push(
      this.modalService.onHidden.subscribe((reason: string) => {
        this.onModalClose(this.bsModalRef.content);
        this.unsubscribe();
      })
    );
    this.subscriptions.push(_combine);
    const initialState = {
      title: 'Other note',
      candidateId: this.candidateId
    };
    this.bsModalRef = this.modalService.show(OtherNoteComponent, {initialState} as ModalOptions);
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
