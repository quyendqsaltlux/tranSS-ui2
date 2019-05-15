import {Filter} from '../model/Filter';
import {EQUAL} from '../AppConstant';

/**
 *
 * @param page
 * @param size
 * @param keyWord
 * @param orderBy
 * @param sortDirection
 */
export function buildPathParams(page, size, keyWord, orderBy?, sortDirection?) {
  keyWord = keyWord ? keyWord : '';
  size = size ? size : 10;
  if (page && isNaN(page)) {
    page = 0;
  }
  return '?page=' + (page - 1) +
    '&size=' + size +
    '&keyword=' + keyWord +
    '&orderBy=' + (orderBy || '') +
    '&sortDirection=' + (sortDirection || '');
}

/**
 *
 * @param filterModel
 * @param booleanFields
 * @param trueValue
 * @param falseValue
 */
export function buildFilterParam(filterModel, booleanFields?: any[], trueValue?: any, falseValue?: any) {
  if (!filterModel) {
    return null;
  }
  const keys = Object.keys(filterModel);
  if (!keys) {
    return null;
  }
  const filters = [];
  keys.forEach((field) => {
    const filterValue = filterModel[field].value;

    if (filterValue == null || filterValue.toString().trim().length === 0) {
      return;
    }
    const obj = {
      'field': field,
      'operation': filterModel[field].operation,
      'value': filterValue
    };
    if (booleanFields && booleanFields.findIndex((_field) => {
      return _field === field;
    }) >= 0) {
      if (trueValue && trueValue.toUpperCase() === filterValue.toUpperCase()) {
        obj.value = true;
      } else if (falseValue && falseValue.toUpperCase() === filterValue.toUpperCase()) {
        obj.value = false;
      } else {
        obj.value = null;
      }
    }
    filters.push(obj);

  });
  return filters;
}

/**
 *
 * @param filterModel
 * @param joinFilterFields
 */
export function separateFiltersFromGrid(filterModel, joinFilterFields: string[]) {
  if (!filterModel) {
    return null;
  }
  const keys = Object.keys(filterModel);
  if (!keys) {
    return null;
  }
  const rootFilter = {};
  const joinFilter = {};

  keys.forEach((field) => {
    if (joinFilterFields.findIndex((joinField) => joinField === field) < 0) {
      rootFilter[field] = gridFilter2Filter(field, filterModel[field]);
    } else {
      const items = field.split('.');
      const last = items[items.length - 1];
      joinFilter[last] = gridFilter2Filter(last, filterModel[field]);
    }
  });
  return {root: rootFilter, join: joinFilter};
}

/**
 *
 * @param filterModel
 */
export function generateFilterParam(filterModel) {
  if (!filterModel) {
    return null;
  }
  const keys = Object.keys(filterModel);
  if (!keys) {
    return null;
  }
  const filters = [];
  keys.forEach((field) => {
    filters.push(filterModel[field]);
  });
  return filters;
}

/**
 *
 * @param field
 * @param filter
 */
export function gridFilter2Filter(field, filter) {
  if (!filter) {
    return null;
  }
  const targetFilter = {} as Filter;
  targetFilter.field = field;
  targetFilter.operation = EQUAL;

  switch (filter.filterType) {
    case 'text':
      targetFilter.value = filter.filter;
      break;
    case 'date':
      targetFilter.value = filter.dateFrom;
      break;
  }
  return targetFilter;
}
