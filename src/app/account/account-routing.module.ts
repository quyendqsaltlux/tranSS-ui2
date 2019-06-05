import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../gaurd/AuthGuard';
import {RoleGuard} from '../gaurd/RoleGuard';
import {UserSettingComponent} from './user-setting/user-setting.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      title: 'Account',
      roles: ['ROLE_USER', 'ROLE_PM', 'ROLE_RM']
    },
    children: [
      {path: '', redirectTo: 'user-setting', pathMatch: 'full'},
      {path: 'user-setting', component: UserSettingComponent, data: {title: 'Setting'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
