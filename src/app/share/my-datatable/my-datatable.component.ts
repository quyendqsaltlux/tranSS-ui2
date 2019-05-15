import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BsDatepickerConfig, BsLocaleService} from 'ngx-bootstrap';
import * as _ from 'lodash';

export const FILTER_TYPE_ROOT = 'root';
export const FILTER_TYPE_JOIN = 'join';

export class MyDatatableItem {
  field: string;
  label: string;
  sortAble: boolean;
  filterAble: boolean;
  filterType: string;
  filterKey: string;
  inputType?: string;


  constructor(field: string, label: string, sortAble: boolean,
              filterAble: boolean, filterType: string, filterKey: string,
              inputType?: string) {
    this.field = field;
    this.label = label;
    this.sortAble = sortAble;
    this.filterAble = filterAble;
    this.inputType = inputType ? inputType : 'text';
    this.filterType = filterType ? filterType : FILTER_TYPE_ROOT;
    this.filterKey = filterKey ? filterKey : field;
  }
}

@Component({
  selector: 'app-my-datatable',
  templateUrl: './my-datatable.component.html',
  styleUrls: ['./my-datatable.component.scss']
})
export class MyDatatableComponent implements OnInit {
  @Input() sortConfig = {};
  @Input() filter = {};
  @Input() joinFilter = {};
  @Input() cols: MyDatatableItem[] = [];
  @Input() rows = [];
  @Output() nextSort: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();
  dateConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'YYYY-MM-DD',
    containerClass: 'theme-blue'
  } as Partial<BsDatepickerConfig>;
  locale = 'en';

  filterWrapper = {
    root: {},
    join: {}
  };

  constructor(private localeService: BsLocaleService) {
  }

  ngOnInit() {
    this.localeService.use(this.locale);
    this.filterWrapper[FILTER_TYPE_ROOT] = _.cloneDeep(this.filter);
    this.filterWrapper[FILTER_TYPE_JOIN] = _.cloneDeep(this.joinFilter);
  }

  toggleSort(col: MyDatatableItem) {
    if (this.sortConfig['field'] === col.field) {
      if (this.sortConfig['order'] === 'desc') {
        this.sortConfig['order'] = 'asc';
      } else {
        this.sortConfig['order'] = 'desc';
      }
    } else {
      this.sortConfig['field'] = col.field;
      this.sortConfig['order'] = 'asc';
    }
    this.nextSort.emit(this.sortConfig);
  }

  onFilter($event?, col?) {
    /*DATE PICKER*/
    if ($event && col) {
      this.filterWrapper[col.filterType][col.filterKey].value = $event;
    }
    this.filterChange.emit(this.filterWrapper);
  }
}
