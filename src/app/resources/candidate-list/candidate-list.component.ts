import {Component, OnInit} from '@angular/core';
import {CandidateService} from '../../service/candidate.service';
import {EQUAL} from '../../AppConstant';
import {buildFilterParam} from '../../util/http-util';
import * as _ from 'lodash';
import {FILTER_TYPE_JOIN, FILTER_TYPE_ROOT, MyDatatableItem} from '../../share/my-datatable/my-datatable.component';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit {
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

  filter = {
    name: {operation: EQUAL, value: null},
    email: {operation: EQUAL, value: null},
    email2: {operation: EQUAL, value: null},
    code: {operation: EQUAL, value: null},
    catTool: {operation: EQUAL, value: null},
    mobile: {operation: EQUAL, value: null},
    messenger: {operation: EQUAL, value: null},
    address: {operation: EQUAL, value: null}
  };
  abilityFilter = {
    sourceLanguage: {operation: EQUAL, value: null},
    targetLanguage: {operation: EQUAL, value: null},
    projectType: {operation: EQUAL, value: null},
    rate: {operation: EQUAL, value: null},
    rateUnit: {operation: EQUAL, value: null},
    rate2: {operation: EQUAL, value: null},
    rate2unit: {operation: EQUAL, value: null},
    minimumCharge: {operation: EQUAL, value: null},
    task: {operation: EQUAL, value: null},
  };

  orderFields = ['sourceLanguage', 'targetLanguage', 'projectType', 'rate', 'rateUnit', 'rate2', 'rate2unit', 'minimumCharge', 'task'];
  cols: MyDatatableItem[] = [];

  constructor(private  candidateService: CandidateService) {
  }

  ngOnInit() {
    this.getModelList();
    this.buildTableCols();
  }

  buildTableCols() {
    this.cols = [
      new MyDatatableItem(null, 'Action', false, false, null, null),
      new MyDatatableItem('name', 'Name', true, true, null, null),
      new MyDatatableItem('code', 'Code', true, true, null, null),
      new MyDatatableItem('email', 'Email', true, true, null, null),
      new MyDatatableItem('projectType', 'Project Type', true, true, FILTER_TYPE_JOIN, 'projectType'),
      new MyDatatableItem('sourceLanguage', 'Source', true, true, FILTER_TYPE_JOIN, 'sourceLanguage', 'text'),
      new MyDatatableItem('targetLanguage', 'Target', true, true, FILTER_TYPE_JOIN, 'targetLanguage', 'text'),
      new MyDatatableItem('task', 'Task', true, true, FILTER_TYPE_JOIN, 'task'),
      new MyDatatableItem('rate', 'Rate', true, true, FILTER_TYPE_JOIN, 'rate'),
      new MyDatatableItem('rateUnit', '(word/char)', true, true, FILTER_TYPE_JOIN, 'rateUnit'),
      new MyDatatableItem('rate2', 'Rate hour', true, true, FILTER_TYPE_JOIN, 'rate2'),
      new MyDatatableItem('rate2unit', '(hour)', true, true, FILTER_TYPE_JOIN, 'rateUnit2'),
      new MyDatatableItem('minimumCharge', 'Minimum Charge', true, true, null, null),
      new MyDatatableItem('catTool', 'CAT Tool', true, true, null, null),
      new MyDatatableItem('mobile', 'Mobile', true, true, null, null),
      new MyDatatableItem('messenger', 'Messenger', true, true, null, null),
      new MyDatatableItem('address', 'Address', true, true, null, null),
    ];
  }

  getModelList() {
    this.candidateService.search(this.page, this.size, this.keyWord, this.sortConfig.field, this.sortConfig.order,
      buildFilterParam(this.filter),
      buildFilterParam(this.abilityFilter)
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
      this.onToggleShowOtherAbility();
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
