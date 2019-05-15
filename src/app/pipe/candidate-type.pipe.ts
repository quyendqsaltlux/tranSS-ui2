import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'candidateType'
})
export class CandidateTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'TL'  :
        return 'Translation LSP';
      case 'TF'  :
        return 'Translation Freelancer';
      case 'DL'  :
        return 'DTP LSP';
      case 'DF'  :
        return 'DTP Freelancer';
      case 'IL'  :
        return 'Interpretation LSP';
      case 'IF'  :
        return 'Interpretation Freelancer';
      case 'VL'  :
        return 'Voice-over LSP';
      case 'VF'  :
        return 'Voice-over Freelancer';
      default :
        return value;
    }
  }

}
