import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'testWaitingInternalCheck'
})
export class TestWaitingEvaluatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'QUALIFIED':
        return 'Qualified';
      case 'Not Qualified':
        return 'Fail';
    }
  }

}
