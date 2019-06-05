import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MigrateDataComponent} from './migrate-data/migrate-data.component';
import {AdminRoutingModule} from './admin-routing.module';
import {ShareModule} from '../share/share.module';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [MigrateDataComponent, UsersComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ShareModule
  ]
})
export class AdminModule {
}
