import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EQUAL} from '../../AppConstant';
import {FILTER_TYPE_JOIN, FILTER_TYPE_ROOT, MyDatatableItem} from '../../share/my-datatable/my-datatable.component';
import {ToastrService} from 'ngx-toastr';
import {buildFilterParam} from '../../util/http-util';
import * as _ from 'lodash';
import {needRemove} from '../../util/string-util';
import {ProjectAssignmentService} from '../../service/project-assignment.service';

@Component({
  selector: 'app-project-history',
  templateUrl: './project-history.component.html',
  styleUrls: ['./project-history.component.scss']
})
export class ProjectHistoryComponent implements OnInit {
  candidateId = null;
  ignoreFilter = true;
  shownModelList = [];
  modelList = [];
  keyWord: string;
  page = 1;
  size = 10;
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
    no: {operation: EQUAL, value: null},
    category: {operation: EQUAL, value: null},
    code: {operation: EQUAL, value: null},
    client: {operation: EQUAL, value: null},
    contents: {operation: EQUAL, value: null},
    field: {operation: EQUAL, value: null},
    totalVolume: {operation: EQUAL, value: null},
    unit: {operation: EQUAL, value: null},
    target: {operation: EQUAL, value: null},
    progressStatus: {operation: EQUAL, value: null},
  };
  assignmentFilter = {
    candidate: {operation: EQUAL, value: null},
    task: {operation: EQUAL, value: null},
    star: {operation: EQUAL, value: null},
    review: {operation: EQUAL, value: null},
    progress: {operation: EQUAL, value: null},
  };

  cols: MyDatatableItem[] = [];
  orderFields = ['task', 'progress', 'star', 'review'];

  constructor(private route: ActivatedRoute,
              private  assignmentService: ProjectAssignmentService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.candidateId = +this.route.snapshot.paramMap.get('candidateId');
    this.assignmentFilter.candidate.value = this.candidateId;
    this.buildTableCols();
    this.getModelList();
  }

  buildTableCols() {
    this.cols = [
      new MyDatatableItem('code', 'Project code', true, false, null, null),
      new MyDatatableItem('contents', 'Contents', false, false, null, null),
      new MyDatatableItem('field', 'Field', false, false, null, null),
      new MyDatatableItem('client', 'Customer', false, false, null, null),
      new MyDatatableItem('source', 'Source', false, false, null, null),
      new MyDatatableItem('target', 'Target', false, false, null, null),
      new MyDatatableItem('task', 'Task', false, false, null, null, null),
      new MyDatatableItem('total', 'Quantity', true, true, null, null),
    ];
  }

  getModelList() {
    this.assignmentService.search(this.candidateId, this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order,
      buildFilterParam(this.filter), [],
      buildFilterParam(this.assignmentFilter),
    )
      .subscribe((resp => {
        if (!resp || !resp.body) {
          this.modelList = [];
          this.totalItems = 0;
          this.numPages = 0;
          return;
        }
        this.modelList = resp.body.content;
        this.totalItems = resp.body.totalElements;
        this.numPages = resp.body.totalPages;

        this.ignoreFilter = false;
        // this.onToggleShowOtherAbility();
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
    this.assignmentFilter = _.cloneDeep(event[FILTER_TYPE_JOIN]);
    this.filter = _.cloneDeep(event[FILTER_TYPE_ROOT]);
    this.onFilter();
  }

  onToggleShowOtherAbility() {
    if (this.showOtherAbility) {
      this.shownModelList = _.cloneDeep(this.modelList);
    } else {
      this.shownModelList = this._filterModelList(this.modelList, this.assignmentFilter);
    }
  }

  _filterModelList(originalList, assignmentsFilter) {
    if (!originalList) {
      return [];
    }
    const clonedList = _.cloneDeep(originalList);
    clonedList.forEach((project) => {
      const needRemoveIds = [];
      project.assignments.forEach((assignment, indexAbility) => {
        for (let i = 0; i < this.orderFields.length; i++) {
          const field = this.orderFields[i];
          if (needRemove(assignment[field], assignmentsFilter[field].value)) {
            needRemoveIds.push(indexAbility);
            break;
          }
        }
      });
      if (needRemoveIds.length > 0) {
        needRemoveIds.reverse().forEach((_index) => {
          project.assignments.splice(_index, 1);
        });
      }
    });

    return clonedList;
  }

}
