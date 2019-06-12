export function getFileName(value) {
  if (!value) {
    return value;
  }
  const items = value.split('/');
  return items && items.length > 0 ? items[items.length - 1] : value;
}

export function isContain(parent, sub): boolean {
  return parent && ('' + parent).toLocaleLowerCase().indexOf(sub.toLocaleLowerCase()) >= 0;
}

/**
 * Check if a row need to be remove when filtering candidate abilities or project history task...
 * @param apiValue
 * @param filterValue
 * @returns {boolean}
 * @private
 */
export function needRemove(apiValue, filterValue) {
  if (filterValue) {
    const _isContain = isContain(apiValue, filterValue);
    const _isNaN = isNaN(apiValue);
    if (!apiValue ||
      (_isNaN && !_isContain) ||
      (!_isNaN && apiValue != filterValue)) {
      return true;
    }
  }
  return false;
}

export function hasRole(list1: string[], list2: string[]) {
  let result = false;
  for (let i = 0; i < list2.length; i++) {
    const item = list2[i];
    if (list1.findIndex((item1) => item === item1) >= 0) {
      result = true;
      break;
    }
  }
  return result;
}
