import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {EQUAL} from '../../AppConstant';
import {FILTER_TYPE_ROOT, MyDatatableItem} from '../../share/my-datatable/my-datatable.component';
import {ToastrService} from 'ngx-toastr';
import {buildFilterParam} from '../../util/http-util';
import * as _ from 'lodash';
import {ProjectAssignmentService} from '../../service/project-assignment.service';

@Component({
  selector: 'app-project-history',
  templateUrl: './project-history.component.html',
  styleUrls: ['./project-history.component.scss']
})
export class ProjectHistoryComponent implements OnInit {
  candidateId = null;
  ignoreFilter = true;
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
  filter = {
    projectCode: {operation: EQUAL, value: null},
    client: {operation: EQUAL, value: null},
    total: {operation: EQUAL, value: null},
    target: {operation: EQUAL, value: null},
    source: {operation: EQUAL, value: null},
    task: {operation: EQUAL, value: null},
  };

  cols: MyDatatableItem[] = [];

  constructor(private route: ActivatedRoute,
              private  assignmentService: ProjectAssignmentService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.candidateId = +this.route.snapshot.paramMap.get('candidateId');
    this.buildTableCols();
    this.getModelList();
  }

  buildTableCols() {
    this.cols = [
      new MyDatatableItem('projectCode', 'Project code', true, true, null, null),
      new MyDatatableItem('contents', 'Contents', false, false, null, null),
      new MyDatatableItem('field', 'Field', false, false, null, null),
      new MyDatatableItem('client', 'Customer', false, false, null, null),
      new MyDatatableItem('source', 'Source', false, true, null, null),
      new MyDatatableItem('target', 'Target', false, true, null, null),
      new MyDatatableItem('task', 'Task', false, true, null, null, null),
      new MyDatatableItem('total', 'Quantity', true, true, null, null),
    ];
  }

  getModelList() {
    this.assignmentService.search(this.candidateId, this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order,
      buildFilterParam(this.filter), []
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
    this.filter = _.cloneDeep(event[FILTER_TYPE_ROOT]);
    this.onFilter();
  }
}
