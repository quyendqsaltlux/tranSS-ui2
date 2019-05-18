import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'unit'
})
export class UnitPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if (!value) {
      return value;
    }
    return value.charAt(0);
  }

}
