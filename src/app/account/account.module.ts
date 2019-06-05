import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserSettingComponent} from './user-setting/user-setting.component';
import {ShareModule} from '../share/share.module';
import {AccountRoutingModule} from './account-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [UserSettingComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    ShareModule,
    AccountRoutingModule
  ]
})
export class AccountModule {
}
