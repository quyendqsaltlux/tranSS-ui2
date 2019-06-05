import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'migrateType'
})
export class TestWaitingEvaluatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'PASS':
        return 'Pass';
      case 'FAIL':
        return 'Fail';
      case 'UNEVALUATED':
        return 'Unevaluated';
    }
  }

}
