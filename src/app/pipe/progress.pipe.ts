import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'progress'
})
export class ProgressPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    switch (value) {
      case 'ON_GOING':
        return 'On going';
      case 'NOT_START':
        return 'Not start';
      case 'FINISHED':
        return 'Finished';
      default:
        return 'Not start';
    }
  }

}
