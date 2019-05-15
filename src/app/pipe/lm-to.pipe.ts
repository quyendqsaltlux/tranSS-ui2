import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'lmTo'
})
export class LmToPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value || !args || isNaN(Number(args)) || value.length < args) {
      return value;
    }
    return value.substr(0, args) + '...';
  }

}
