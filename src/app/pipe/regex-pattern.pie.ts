import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'regexPattern',
})
export class RegexPatternPie implements PipeTransform {
  readonly PATTERN = {
    NAMES: /^[^~`!@#$%^&*(),.?":{}[\]|<>;'/\t ]+$/,
    CATEGORY: /^[^~`!@#$%^&*(),.?":{}[\]|<>;'/]+$/,
    VALUES: /^[^~`!@#$%^&*(),.?":{}[\]|<>;'/]+$/,
    pNUMBERS: /^\d+$/
  };

  transform(value: any): RegExp {
    if (!value) {
      return;
    }
    return this.PATTERN[value];
  }
}
