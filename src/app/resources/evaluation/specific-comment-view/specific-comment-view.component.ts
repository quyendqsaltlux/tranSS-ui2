import {Component, Input, OnInit} from '@angular/core';
import {EvaluationService} from '../../../service/evaluation.service';
import {ActionsColRendererComponent} from '../../../share/ag-grid/actions-col-renderer.component';

@Component({
  selector: 'app-specific-comment-view',
  templateUrl: './specific-comment-view.component.html',
  styleUrls: ['./specific-comment-view.component.scss']
})
export class SpecificCommentViewComponent implements OnInit {
  @Input() candidateId;
  JOIN_FILTER_COLS = [];
  columnDefs = [
    {headerName: 'Project', field: 'assignment.project.code'},
    {headerName: 'volume', field: 'assignment.project.totalVolume'},
    {headerName: 'Field', field: 'assignment.project.field'},
    {headerName: 'Document', field: 'assignment.project.contents', width: 250},
    {headerName: 'Level of difficulty', field: 'level', width: 200},
    {headerName: 'Comment', field: 'comment', width: 350},
    {headerName: 'Evaluator', field: 'evaluator'},
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

  constructor(private evaluationService: EvaluationService) {
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
      childMessageRenderer: ActionsColRendererComponent
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getSpecificComments();
  }

  getSpecificComments() {
    this.evaluationService.searchSpecificComment(this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order, [], [], this.candidateId)
      .subscribe((resp) => {
        this.modelList = [...resp.body.content];
        this.totalItems = resp.body.totalElements;
        this.numPages = resp.body.totalPages;
      });
  }
}
