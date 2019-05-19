import {Component, OnInit} from '@angular/core';
import {CandidateService} from '../../service/candidate.service';
import {buildFilterItem, separateFiltersFromGrid} from '../../util/http-util';
import * as _ from 'lodash';
import {FILTER_TYPE_JOIN, FILTER_TYPE_ROOT} from '../../share/my-datatable/my-datatable.component';
import {CandidateActionsColRendererComponent} from '../../share/ag-grid/candidate-actions-col-renderer.component';
import {Router} from '@angular/router';
import {AbilityCellComponent} from '../../share/ag-grid/ability-cell/ability-cell.component';
import {AbilityFilterComponent} from '../../share/ag-grid/ability-filter/ability-filter.component';
import {DateCellComponent} from '../../share/ag-grid/date-cell/date-cell.component';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit {
  JOIN_FILTER_COLS = ['projectType', 'sourceLanguage', 'targetLanguage', 'task', 'rate', 'rateUnit', 'rate2', 'rate2unit', 'currency'];
  columnDefs = [
    // {headerName: '#', colId: 'rowNum', valueGetter: 'node.id', width: 40, pinned: 'left', filter: false, sortable: false},
    {headerName: 'Actions', colId: 'rowActions', cellRenderer: 'actionRender', pinned: 'left', filter: false, width: 90, sortable: false},
    {headerName: 'Code', field: 'code', pinned: 'left', filter: false, width: 100},
    {headerName: 'Grade', field: 'grade', width: 70},
    {headerName: 'name', field: 'name', width: 150},
    {headerName: 'majorField', field: 'majorField'},
    {
      headerName: 'Project Type',
      field: 'projectType',
      floatingFilterComponent: 'abilityFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true, onFloatingFilterChanged: (data) => {
          this.onJoinFilterChange(data, 'projectType');
        }
      },
      width: 100,
      cellRenderer: 'abilityRender',
      cellRendererParams: {renderField: 'projectType'},
    },
    {
      headerName: 'Source', field: 'sourceLanguage', width: 70, cellRenderer: 'abilityRender', cellRendererParams: {renderField: 'sourceLanguage'},
      floatingFilterComponent: 'abilityFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true, onFloatingFilterChanged: (data) => {
          this.onJoinFilterChange(data, 'sourceLanguage');
        }
      }
    },
    {
      headerName: 'Target', field: 'targetLanguage', width: 70, cellRenderer: 'abilityRender', cellRendererParams: {renderField: 'targetLanguage'},
      floatingFilterComponent: 'abilityFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true, onFloatingFilterChanged: (data) => {
          this.onJoinFilterChange(data, 'targetLanguage');
        }
      }
    },
    {
      headerName: 'Task', field: 'task', width: 70, cellRenderer: 'abilityRender', cellRendererParams: {renderField: 'task'},
      floatingFilterComponent: 'abilityFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true, onFloatingFilterChanged: (data) => {
          this.onJoinFilterChange(data, 'task');
        }
      }
    },
    {
      headerName: 'Rate', field: 'rate', width: 70, cellRenderer: 'abilityRender', cellRendererParams: {renderField: 'rate'},
      floatingFilterComponent: 'abilityFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true, onFloatingFilterChanged: (data) => {
          this.onJoinFilterChange(data, 'rate');
        }
      }
    },
    {
      headerName: 'Rate (word/char)', field: 'rateUnit', cellRenderer: 'abilityRender', cellRendererParams: {renderField: 'rateUnit'},
      floatingFilterComponent: 'abilityFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true, onFloatingFilterChanged: (data) => {
          this.onJoinFilterChange(data, 'rateUnit');
        }
      }
    },
    {
      headerName: 'Rate Hour', field: 'rate2', width: 80, cellRenderer: 'abilityRender', cellRendererParams: {renderField: 'rate2'},
      floatingFilterComponent: 'abilityFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true, onFloatingFilterChanged: (data) => {
          this.onJoinFilterChange(data, 'rate2');
        }
      }
    },
    {
      headerName: '(hour)', field: 'rate2unit, width: 50', cellRenderer: 'abilityRender', cellRendererParams: {renderField: 'rate2unit'},
      floatingFilterComponent: 'abilityFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true, onFloatingFilterChanged: (data) => {
          this.onJoinFilterChange(data, 'rate2unit');
        }
      }
    },
    {
      headerName: 'Currency', field: 'currency', width: 80, cellRenderer: 'abilityRender', cellRendererParams: {renderField: 'currency'},
      floatingFilterComponent: 'abilityFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true, onFloatingFilterChanged: (data) => {
          this.onJoinFilterChange(data, 'currency');
        }
      }
    },
    {headerName: 'minimumCharge', field: 'minimumCharge', type: 'numericColumn'},
    {headerName: 'CAT Tool', field: 'catTool'},
    {headerName: 'Email', field: 'email', width: 250},
    {headerName: 'Mobile', field: 'mobile'},
    {headerName: 'Messenger', field: 'messenger'},
    {headerName: 'Social Pages', field: 'socialpages'},
    {headerName: 'Personal Id', field: 'personalId'},
    {headerName: 'Gender', field: 'gender'},
    {headerName: 'DOB', field: 'dateOfBirth', type: 'dateColumn', width: 170, cellRenderer: 'dateRender', cellRendererParams: {renderField: 'dateOfBirth'}},
    {
      headerName: 'Daily Capacity', field: 'dailyCapacity',
      cellRenderer: 'abilityRender', cellRendererParams: {renderField: 'abilityRender'},
      floatingFilterComponent: 'abilityFilter',
      floatingFilterComponentParams: {
        suppressFilterButton: true, onFloatingFilterChanged: (data) => {
          this.onJoinFilterChange(data, 'abilityRender');
        }
      }
    },
    {headerName: 'Country', field: 'country'},
    {headerName: 'Updated At', field: 'updatedAt', type: 'dateColumn', width: 170, filter: false, cellRenderer: 'dateRender', cellRendererParams: {renderField: 'updatedAt'}},
    {headerName: 'Address', field: 'address', width: 250},
  ];
  /*AG_GRID*/
  private gridApi;
  private gridColumnApi;
  private defaultColDef;
  private columnTypes;
  private context;
  private frameworkComponents;
  private sortingOrder;
  private getRowHeight;

  shownModelList = [];
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
  showOtherAbility = false;

  filter = [];
  abilityFilter = [];

  orderFields = ['sourceLanguage', 'targetLanguage', 'projectType', 'rate', 'rateUnit', 'rate2', 'rate2unit', 'minimumCharge', 'task'];

  constructor(private  candidateService: CandidateService,
              public route: Router) {
  }

  ngOnInit() {
    this.initTable();
    this.getModelList();
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
      actionRender: CandidateActionsColRendererComponent,
      abilityRender: AbilityCellComponent,
      abilityFilter: AbilityFilterComponent,
      dateRender: DateCellComponent,
    };
    this.getRowHeight = (params) => {
      return params.data.abilities.length * 27;
    };
  }


  onJoinFilterChange(data, field) {
    const filterItem = {};
    filterItem[field] = data.model;
    this.onUpdateJoinFilter(field, filterItem);
  }

  onUpdateJoinFilter(field, newFilterDate) {
    const newFilterItem = buildFilterItem(field, newFilterDate[field]);
    const foundIndex = this.abilityFilter.findIndex((filter) => filter.field === field);
    if (foundIndex < 0) {
      this.abilityFilter.push(newFilterItem);
      this.getModelList();
      return;
    }
    if (newFilterItem == null) {
      this.abilityFilter.splice(foundIndex, 1);
    } else if (newFilterItem != null) {
      this.abilityFilter[foundIndex] = newFilterItem;
    }
    this.getModelList();
  }

  onGridFilterChange(event) {
    const filters = this.gridApi != null ? this.gridApi.getFilterModel() : null;
    const separatedFilter = separateFiltersFromGrid(filters, this.JOIN_FILTER_COLS);
    this.filter = [...separatedFilter.root];
    this.getModelList();
  }

  gotoEditForm(index) {
    this.route.navigate(['/resources/edit/' + this.modelList[index].id]);
  }

  onViewHistory(index) {
    this.route.navigate(['/resources/' + this.modelList[index].id + '/project-history']);
  }

  getModelList() {
    this.candidateService.search(this.page, this.size, this.keyWord, this.sortConfig.field, this.sortConfig.order,
      this.filter, this.abilityFilter
    ).subscribe((resp => {
      if (!resp || !resp.body) {
        this.modelList = [];
        this.totalItems = 0;
        this.numPages = 0;
        return;
      }
      this.modelList = resp.body.content;
      this.totalItems = resp.body.totalElements;
      this.numPages = resp.body.totalPages;
    }));
  }

  onClickSearch() {
    this.page = 1;
    this.getModelList();
  }

  onFilter() {
    this.page = 1;
    this.getModelList();
  }

  pageChanged(event) {
    setTimeout((e) => {
      this.getModelList();
    }, 0);
  }

  onToggleShowOtherAbility() {
    if (this.showOtherAbility) {
      this.shownModelList = _.cloneDeep(this.modelList);
    } else {
      this.shownModelList = this._filterModelList(this.modelList, this.abilityFilter);
    }
  }

  _filterModelList(originalList, abilityFilter) {
    if (!originalList) {
      return [];
    }
    const clonedList = _.cloneDeep(originalList);
    clonedList.forEach((candidate) => {
      const needRemoveIds = [];
      candidate.abilities.forEach((ability, indexAbility) => {
        for (let i = 0; i < this.orderFields.length; i++) {
          const field = this.orderFields[i];
          if (this._needRemove(ability[field], abilityFilter[field].value)) {
            needRemoveIds.push(indexAbility);
            break;
          }
        }
      });
      if (needRemoveIds.length > 0) {
        needRemoveIds.reverse().forEach((_index) => {
          candidate.abilities.splice(_index, 1);
        });
      }
    });

    return clonedList;
  }

  _needRemove(abilityValue, filterValue) {
    if (filterValue) {
      const isContain = this.isContain(abilityValue, filterValue);
      const _isNaN = isNaN(abilityValue);
      if (!abilityValue ||
        (_isNaN && !isContain) ||
        (!_isNaN && abilityValue != filterValue)) {
        return true;
      }
    }
    return false;
  }

  isContain(parent, sub): boolean {
    return parent && ('' + parent).toLocaleLowerCase().indexOf(sub.toLocaleLowerCase()) >= 0;
  }

  onFilterChange(event) {
    this.abilityFilter = _.cloneDeep(event[FILTER_TYPE_JOIN]);
    this.filter = _.cloneDeep(event[FILTER_TYPE_ROOT]);
    this.onFilter();
  }

  toggleSort(sortData) {
    this.sortConfig.field = sortData.field;
    this.sortConfig.order = sortData.order;
    this.getModelList();
  }
}
