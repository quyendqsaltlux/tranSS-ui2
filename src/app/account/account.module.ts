import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserSettingComponent} from './user-setting/user-setting.component';
import {ShareModule} from '../share/share.module';
import {AccountRoutingModule} from './account-routing.module';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {AvatarUploaderComponent} from './avatar-uploader/avatar-uploader.component';

@NgModule({
  declarations: [
    UserSettingComponent,
    ChangePasswordComponent,
    AvatarUploaderComponent
  ],
  imports: [
    CommonModule,
    ShareModule,
    AccountRoutingModule
  ],
  entryComponents: [AvatarUploaderComponent],
})
export class AccountModule {
}
