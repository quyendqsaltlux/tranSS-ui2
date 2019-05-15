import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'projectProgress'
})
export class ProjectProgressPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    switch (value) {
      case 'ON_GOING':
        return '<i class="fa fa-refresh"></i> On going';
      case 'HOLD':
        return '<i class="fa fa-warning text-warning"></i> Hold';
      case 'FINISHED':
        return '<i class="fa fa-check text-success"></i> Finished';
      case 'NOT_START':
        return '<i class="fa fa-dot-circle-o"></i> Not start';
      default:
        return '-';
    }
  }

}
