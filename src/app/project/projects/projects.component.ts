import {Component, OnInit, TemplateRef} from '@angular/core';
import {ProjectService} from '../../service/project.service';
import {FILTER_TYPE_JOIN, FILTER_TYPE_ROOT} from '../../share/my-datatable/my-datatable.component';
import * as _ from 'lodash';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {generateFilterParam, separateFiltersFromGrid} from '../../util/http-util';
import {EQUAL} from '../../AppConstant';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  JOIN_FILTER_COLS = ['pm.code'];
  columnDefs = [
    {headerName: '#', colId: 'rowNum', valueGetter: 'node.id', width: 40, pinned: 'left', filter: false},
    {headerName: 'No', field: 'no', pinned: 'left', sortable: true, filter: true},
    {headerName: 'Request Date', field: 'requestDate', type: 'dateColumn', width: 170},
    {headerName: 'Due Date', field: 'dueDate', width: 170, type: 'dateColumn'},
    {headerName: 'Due Time', field: 'dueTime'},
    {headerName: 'PM', field: 'pm.code'},
    {headerName: 'Category', field: 'category'},
    {headerName: 'Code', field: 'code'},
    {headerName: 'Folder Name', field: 'folderName'},
    {headerName: 'Client', field: 'client'},
    {headerName: 'Contents', field: 'contents', width: 250},
    {headerName: 'Reference', field: 'reference', width: 100},
    {headerName: 'Termbase', field: 'termbase', width: 100},
    {headerName: 'Instruction', field: 'instruction', width: 100},
    {headerName: 'Remark', field: 'remark', width: 250},
    {headerName: 'Total Volume', field: 'totalVolume', type: 'numericColumn'},
    {headerName: 'Unit', field: 'unit'},
    {headerName: 'Target', field: 'target'},
    {headerName: 'Progress', field: 'progressStatus', filter: false},
    {headerName: 'PM Vtc', field: 'pmVtc'},
    {headerName: 'HO', field: 'ho', width: 170, type: 'dateColumn'},
    {headerName: 'HB', field: 'hb', width: 170, type: 'dateColumn'},
    {headerName: 'Review Schedule', width: 170, field: 'reviewSchedule', type: 'dateColumn'},
    {headerName: 'Final Delivery', width: 170, field: 'finalDelivery', type: 'dateColumn'}
  ];

  private gridApi;
  private gridColumnApi;
  private defaultColDef;
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

  filter = {};
  pmFilter = {};

  deleteId = -1;
  activeResourceIndex = -1;

  constructor(private  projectService: ProjectService,
              private toastr: ToastrService,
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
      width: 150,
      editable: false,
      filter: 'agTextColumnFilter',
      suppressMenu: true,
      floatingFilterComponentParams: {suppressFilterButton: true},
      filterParams: {newRowsAction: 'keep'}
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
  }

  getModelList() {
    this.filter['progressStatus'] = {operation: EQUAL, value: this.activedTab, field: 'progressStatus'};

    this.projectService.search(this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order,
      generateFilterParam(this.filter),
      generateFilterParam(this.pmFilter),
      [])
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

  onGridFilterChange(event) {
    const filters = this.gridApi != null ? this.gridApi.getFilterModel() : null;
    console.log(filters);
    const separatedFilter = separateFiltersFromGrid(filters, this.JOIN_FILTER_COLS);
    this.filter = {...separatedFilter.root};
    this.pmFilter = {...separatedFilter.join};
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
