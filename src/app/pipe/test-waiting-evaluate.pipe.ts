import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'test-waiting-internal-check'
})
export class TestWaitingEvaluatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'QUALIFIED':
        return 'Pass';
      case 'NOT_QUALIFIED':
        return 'Fail';
    }
  }

}
