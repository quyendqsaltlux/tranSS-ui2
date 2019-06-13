import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn} from '@angular/forms';
import {FLOAT_REGEX} from '../AppConstant';

/** A hero's name can't match the given regular expression */
export function percentValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value == null) {
      return null;
    }
    const isPositiveFloat = FLOAT_REGEX.test(control.value);
    const isLessThan100 = !isNaN(Number(control.value)) && Number(control.value) <= 100;
    return !isPositiveFloat || !isLessThan100 ? {appPercent: {value: control.value}} : null;
  };
}

@Directive({
  selector: '[appPercent]',
  providers: [{provide: NG_VALIDATORS, useExisting: PercentDirective, multi: true}]
})
export class PercentDirective implements Validator {
  @Input('appPercent') forbiddenName: string;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.forbiddenName ? percentValidator(new RegExp(this.forbiddenName, 'i'))(control)
      : null;
  }
}
