import {Pipe, PipeTransform} from '@angular/core';
import {getFileName} from '../util/string-util';

@Pipe({
  name: 'fileName'
})
export class FileNamePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return getFileName(value);
  }

}
