import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'migrateType'
})
export class MigrateTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case 'USERS':
        return '<i class="fa fa-users text-primary"></i> Users';
      case 'RESOURCES':
        return '<i class="fa fa-address-book text-primary"></i> Resources';
      case 'FINISHED_PROJECTS':
        return '<i class="fa fa-list-ol text-primary"></i> Finished projects';
      case 'ONGOING_PROJECTS':
        return '<i class="fa fa-list-ol text-primary"></i> Ongoing projects';
      case 'KOREA_PAYMENT':
        return '<i class="fa fa-dollar text-primary"></i> Korea payments';
      case 'OVERSEA_PAYMENT':
        return '<i class="fa fa-dollar text-primary"></i> Oversea payments';
      case 'ASSIGNMENTS':
        return '<i class="fa fa-user text-primary"></i> Assignment';
      case 'TEST_WAITING':
        return '<i class="fa fa-minus-square-o text-primary"></i> Unevaluated resource';
    }
  }

}
