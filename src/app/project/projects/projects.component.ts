import {Component, OnInit, TemplateRef} from '@angular/core';
import {EQUAL} from '../../AppConstant';
import {buildFilterParam} from '../../util/http-util';
import {ProjectService} from '../../service/project.service';
import {FILTER_TYPE_JOIN, FILTER_TYPE_ROOT, MyDatatableItem} from '../../share/my-datatable/my-datatable.component';
import * as _ from 'lodash';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {Router} from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  columnDefs = [
    {headerName: '#', colId: 'rowNum', valueGetter: 'node.id', width: 40, pinned: 'left', filter: false},
    {headerName: 'no', field: 'no', width: 150, pinned: 'left', sortable: true, filter: true},
    {headerName: 'requestDate', field: 'requestDate', width: 150, pinned: 'left', type: ['dateColumn']},
    {headerName: 'dueDate', field: 'dueDate', width: 120},
    {headerName: 'dueTime', field: 'dueTime', width: 90},
    {headerName: 'pm', field: 'pm.username', width: 110},
    {headerName: 'category', field: 'category', width: 110},
    {headerName: 'code', field: 'code', width: 100},
    {headerName: 'folderName', field: 'folderName', width: 100},
    {headerName: 'client', field: 'client', width: 100},
    {headerName: 'contents', field: 'contents', width: 100},
    {headerName: 'reference', field: 'reference', width: 100},
    {headerName: 'termbase', field: 'termbase', width: 100},
    {headerName: 'instruction', field: 'instruction', width: 100},
    {headerName: 'remark', field: 'remark', width: 100},
    {headerName: 'totalVolume', field: 'totalVolume', width: 100, type: 'numericColumn'},
    {headerName: 'unit', field: 'unit', width: 100},
    {headerName: 'target', field: 'target', width: 100},
    {headerName: 'progressStatus', field: 'progressStatus', width: 100},
    {headerName: 'pmVtc', field: 'pmVtc', width: 100},
    {headerName: 'ho', field: 'ho', width: 100},
    {headerName: 'hb', field: 'hb', width: 100},
    {headerName: 'reviewSchedule', field: 'reviewSchedule', width: 100},
    {headerName: 'finalDelivery', field: 'finalDelivery', width: 100},
  ];

  private gridApi;
  private gridColumnApi;

  private defaultColDef;
  private defaultColGroupDef;
  private columnTypes;

  activedTab = 'ON_GOING';
  ignoreFilter = true;
  modalRef: BsModalRef;
  modelList = [];
  keyWord: string;
  page = 1;
  size = 50;
  numPages = 0;
  totalItems = 0;
  sortConfig: {
    field: string,
    order: string
  } = {
    field: null,
    order: null
  };

  filter = {
    no: {operation: EQUAL, value: null},
    requestDate: {operation: EQUAL, value: null},
    dueDate: {operation: EQUAL, value: null},
    dueTime: {operation: EQUAL, value: null},
    category: {operation: EQUAL, value: null},
    code: {operation: EQUAL, value: null},
    folderName: {operation: EQUAL, value: null},
    client: {operation: EQUAL, value: null},
    contents: {operation: EQUAL, value: null},
    reference: {operation: EQUAL, value: null},
    termbase: {operation: EQUAL, value: null},
    instruction: {operation: EQUAL, value: null},
    remark: {operation: EQUAL, value: null},
    totalVolume: {operation: EQUAL, value: null},
    unit: {operation: EQUAL, value: null},
    target: {operation: EQUAL, value: null},
    progressStatus: {operation: EQUAL, value: this.activedTab},
    pmVtc: {operation: EQUAL, value: null},
    ho: {operation: EQUAL, value: null},
    hb: {operation: EQUAL, value: null},
    reviewSchedule: {operation: EQUAL, value: null},
    reviewResource: {operation: EQUAL, value: null},
    finalDelivery: {operation: EQUAL, value: null},
  };
  pmFilter = {
    code: {operation: EQUAL, value: null}
  };

  cols: MyDatatableItem[] = [];

  deleteId = -1;
  activeResourceIndex = -1;

  constructor(private  projectService: ProjectService,
              private toastr: ToastrService,
              public route: Router,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.initTable();
    this.buildTableCols();
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getModelList();
  }

  initTable() {
    this.defaultColDef = {
      width: 150,
      editable: false,
      filter: 'agTextColumnFilter'
    };
    this.defaultColGroupDef = {marryChildren: true};
    this.columnTypes = {
      numericColumn: {
        width: 83,
        filter: 'agNumberColumnFilter'
      },
      medalColumn: {
        width: 100,
        columnGroupShow: 'open',
        filter: false
      },
      nonEditableColumn: {editable: false},
      dateColumn: {
        filter: 'agDateColumnFilter',
        filterParams: {
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
  }

  buildTableCols() {
    this.cols = [
      new MyDatatableItem(null, 'Action', false, false, null, null),
      new MyDatatableItem('no', 'No', true, true, null, null),
      new MyDatatableItem('requestDate', 'Request date', true, true, null, null, 'date'),
      new MyDatatableItem('dueDate', 'Due date', true, true, null, null, 'date'),
      new MyDatatableItem('dueTime', 'Due time', true, true, null, null),
      new MyDatatableItem('pm', 'PM', true, true, FILTER_TYPE_JOIN, 'code', 'text'),
      new MyDatatableItem('category', 'Category', true, true, null, null),
      new MyDatatableItem('code', 'Code', true, true, null, null),
      new MyDatatableItem('folderName', 'Folder name', true, true, null, null),
      new MyDatatableItem('client', 'Client', true, true, null, null),
      new MyDatatableItem('contents', 'Contents', true, true, null, null),
      new MyDatatableItem('reference', 'Reference', true, true, null, null),
      new MyDatatableItem('termbase', 'Term base', true, true, null, null),
      new MyDatatableItem('instruction', 'Instruction', true, true, null, null),
      new MyDatatableItem('remark', 'Remark', true, true, null, null),
      new MyDatatableItem('totalVolume', 'Total volume', true, true, null, null),
      new MyDatatableItem('unit', 'Unit', true, true, null, null),
      new MyDatatableItem('target', 'Target', true, true, null, null),
      new MyDatatableItem('progressStatus', 'Status', true, false, null, null),
      new MyDatatableItem('pmVtc', 'PM (VTC)', true, true, null, null),
      new MyDatatableItem('ho', 'HO', true, true, null, null, 'date'),
      new MyDatatableItem('hb', 'HB', true, true, null, null, 'date'),
      // new MyDatatableItem(null, 'Resources', false, false, null, null),
      new MyDatatableItem('reviewSchedule', 'Review schedule', true, true, null, null, 'date'),
      new MyDatatableItem('finalDelivery', 'Final delivery', true, true, null, null, 'date'),
    ];
  }

  getModelList() {
    this.filter.progressStatus.value = this.activedTab;
    this.projectService.search(this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order,
      buildFilterParam(this.filter),
      buildFilterParam(this.pmFilter),
      []
    )
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

  pageChanged(event) {
    setTimeout((e) => {
      this.getModelList();
    }, 0);
  }

  toggleSort(sortData) {
    this.sortConfig.field = sortData.field;
    this.sortConfig.order = sortData.order;
    this.getModelList();
  }

  onFilterChange(event) {
    this.pmFilter = _.cloneDeep(event[FILTER_TYPE_JOIN]);
    this.filter = _.cloneDeep(event[FILTER_TYPE_ROOT]);
    this.onFilter();
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
    this.projectService.deleteById(this.deleteId).subscribe((resp) => {
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

  onToggleResource(index) {
    if (index === this.activeResourceIndex) {
      this.activeResourceIndex = -1;
      return;
    }
    this.activeResourceIndex = index;
  }

  onClickTab(tab) {
    if (tab !== this.activedTab) {
      this.activedTab = tab;
      this.getModelList();
    }
  }
}
