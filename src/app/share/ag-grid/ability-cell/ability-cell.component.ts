import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import {AbilityCellService} from '../../../service/ag-grid/ability-cell.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-ability-cell',
  templateUrl: './ability-cell.component.html',
  styleUrls: ['./ability-cell.component.scss']
})
export class AbilityCellComponent implements ICellRendererAngularComp {
  public params: any;
  filters = [];
  abilities = [];
  abilitiesAfterFilter = [];
  renderField: '';
  orderFields = ['sourceLanguage', 'targetLanguage', 'projectType', 'rate', 'rateUnit', 'rate2', 'rate2unit', 'minimumCharge', 'task'];

  constructor(private  abilityCellService: AbilityCellService) {
  }

  agInit(params: any): void {
    this.params = params;
    this.abilities = this.params.data.abilities;
    this.renderField = this.params.renderField;
    this.abilitiesAfterFilter = this._filterModelList(this.abilities, this.abilityCellService.abilityFilter);
  }

  onEdit() {
    this.params.context.componentParent.gotoEditForm(this.params.node.rowIndex);
  }

  onViewHistory() {
    this.params.context.componentParent.onViewHistory(this.params.node.rowIndex);
  }

  refresh(): boolean {
    return false;
  }

  getFilterValue(filters: any[], field): any {
    if (!filters || filters.length === 0) {
      return null;
    }
    const found = filters.find((item) => item.field === field);
    return found ? found.value : null;
  }

  _filterModelList(originalList, abilityFilter) {
    if (!originalList) {
      return [];
    }
    const clonedList = _.cloneDeep(originalList);
    if (!abilityFilter || abilityFilter.length === 0) {
      return clonedList;
    }
    const needRemoveIds = [];
    clonedList.forEach((ability, indexAbility) => {
      for (let i = 0; i < this.orderFields.length; i++) {
        const field = this.orderFields[i];
        if (this._needRemove(ability[field], this.getFilterValue(abilityFilter, field))) {
          needRemoveIds.push(indexAbility);
          break;
        }
      }
    });
    if (needRemoveIds.length > 0) {
      needRemoveIds.reverse().forEach((_index) => {
        clonedList.splice(_index, 1);
      });
    }

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

}
