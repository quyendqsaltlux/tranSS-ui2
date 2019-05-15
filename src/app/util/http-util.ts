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
