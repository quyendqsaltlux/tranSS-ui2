import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'assignmentStatus'
})
export class AssignmentStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) {
      return value;
    }
    if (value === 'NOT_CONFIRMED') {
      return 'Not confirmed';
    } else if (value === 'CONFIRMED') {
      return 'Confirmed';
    }
  }

}
