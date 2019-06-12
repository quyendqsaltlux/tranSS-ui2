import {NgForm} from '@angular/forms';

declare var $: any;

export function focusByName(field: string) {
  const element = $('[name=' + field + ']');
  if (element && element[0]) {
    element.focus();
  }
}

export function focusDuplicatedFields(fields, ngForm: NgForm) {
  if (!fields) {
    return;
  }
  fields.forEach((field) => {
    ngForm.form.controls[field].setErrors({conflict: true});
  });
  focusByName(fields[0]);
}
