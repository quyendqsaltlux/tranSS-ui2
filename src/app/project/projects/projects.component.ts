import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ProjectService} from '../../service/project.service';
import {ToastrService} from 'ngx-toastr';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {separateFiltersFromGrid} from '../../util/http-util';
import {EQUAL} from '../../AppConstant';
import {ActionsColRendererComponent} from '../../share/ag-grid/actions-col-renderer.component';
import {Router} from '@angular/router';
import {ProjectUrgentCellComponent} from '../../share/ag-grid/project-urgent-cell/project-urgent-cell.component';
import {ProgressCellComponent} from '../../share/ag-grid/progress-cell/progress-cell.component';
import {PrincipleService} from '../../service/principle.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  @ViewChild('template') template: TemplateRef<any>;
  JOIN_FILTER_COLS = ['pm.code'];
  columnDefs = [
    {headerName: 'Actions', colId: 'rowActions', cellRenderer: 'actionRender', pinned: 'left', filter: false, width: 90, sortable: false},
    {headerName: 'Progress', field: 'progressPoint', pinned: 'left', filter: false, width: 120, cellRenderer: 'progressCell', cellRendererParams: {renderField: 'progressPoint'}},
    {headerName: 'No', field: 'no', pinned: 'left', filter: true, width: 120, cellRenderer: 'projectUrgentCell', cellRendererParams: {renderField: 'no'}},
    {headerName: 'Request Date', field: 'requestDate', type: 'dateColumn', width: 160},
    {headerName: 'Due Date', field: 'dueDate', width: 160, type: 'dateColumn'},
    {headerName: 'Due Time', field: 'dueTime'},
    {headerName: 'Assigning PM', field: 'pm.code', width: 70},
    {headerName: 'Category', field: 'category', width: 100},
    {headerName: 'Code', field: 'code'},
    {headerName: 'Folder Name', field: 'folderName', width: 150},
    {headerName: 'Client', field: 'client'},
    {headerName: 'Contents', field: 'contents', width: 250, tooltipField: 'contents'},
    {headerName: 'Reference', field: 'reference', width: 80},
    {headerName: 'Termbase', field: 'termbase', width: 80},
    {headerName: 'Instruction', field: 'instruction', width: 90},
    {headerName: 'Remark', field: 'remark', width: 250, tooltipField: 'remark'},
    {headerName: 'Total Volume', field: 'totalVolume', type: 'numericColumn', width: 100},
    {headerName: 'Unit', field: 'unit', width: 70},
    {headerName: 'Target', field: 'target', width: 100},
    {headerName: 'Status', field: 'progressStatus', filter: false, width: 100},
    {headerName: 'Performing PM', field: 'pmVtc', width: 150},
    {headerName: 'HO', field: 'ho', width: 160, type: 'dateColumn'},
    {headerName: 'HB', field: 'hb', width: 160, type: 'dateColumn'},
    {headerName: 'Review Schedule', width: 160, field: 'reviewSchedule', type: 'dateColumn'},
    {headerName: 'Final Delivery', width: 160, field: 'finalDelivery', type: 'dateColumn'}
  ];
  /*AG_GRID*/
  gridApi;
  gridColumnApi;
  defaultColDef;
  columnTypes;
  context;
  frameworkComponents;
  sortingOrder;

  activedTab = 'ON_GOING';
  ignoreFilter = true;
  modalRef: BsModalRef;
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

  filter = [];
  pmFilter = [];
  deleteId = -1;

  constructor(private  projectService: ProjectService,
              private toastr: ToastrService,
              public route: Router,
              private principleService: PrincipleService,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.initTable();
  }

  isAllowCreate() {
    return this.principleService.isPMLeader();
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
      enableBrowserTooltips: true,
      resizable: true,
      filter: 'agTextColumnFilter',
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
      actionRender: ActionsColRendererComponent,
      projectUrgentCell: ProjectUrgentCellComponent,
      progressCell: ProgressCellComponent
    };
  }

  gotoEditForm(index) {
    this.route.navigate(['/projects/edit/' + this.modelList[index].id]);
  }

  /**
   * Change value of progress status like active tab
   */
  injectTabFilter() {
    const tabFilter = this.filter.find((item) => item.field === 'progressStatus');
    if (tabFilter) {
      tabFilter.value = this.activedTab;
    } else {
      this.filter.push({operation: EQUAL, value: this.activedTab, field: 'progressStatus'});
    }
  }

  getModelList() {
    this.injectTabFilter();
    this.projectService.search(this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order,
      this.filter, this.pmFilter, [])
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

  pageChanged() {
    setTimeout(() => {
      this.getModelList();
    }, 0);
  }

  onGridFilterChange(event) {
    const filters = this.gridApi != null ? this.gridApi.getFilterModel() : null;
    const separatedFilter = separateFiltersFromGrid(filters, this.JOIN_FILTER_COLS);
    this.filter = [...separatedFilter.root];
    this.pmFilter = [...separatedFilter.join];
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
    this.projectService.deleteById(this.deleteId).subscribe((resp) => {
        this.toastr.success('Delete successfully!');
        this.onFilter();
      },
      (error1 => {
        if (error1.status === 400) {
          this.toastr.error('Can not delete project includes resources');
          return;
        }
        this.toastr.error('Fail to delete!');
      }));
  }

  decline(): void {
    this.modalRef.hide();
  }

  onClickTab(tab) {
    if (tab !== this.activedTab) {
      this.activedTab = tab;
      this.getModelList();
    }
  }
}
