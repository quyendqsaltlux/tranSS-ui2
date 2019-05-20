import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DefaultLayoutComponent} from './containers';
import {P404Component} from './views/error/404.component';
import {P500Component} from './views/error/500.component';
import {RegisterComponent} from './views/register/register.component';
import {LoginComponent} from './auth/login/login.component';
import {AccessDenyComponent} from './views/error/access-deny/access-deny.component';
import {ServerOffComponent} from './views/error/server-off/server-off.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'access-deny',
    component: AccessDenyComponent,
    data: {
      title: 'Access deny'
    }
  }
  ,
  {
    path: 'server-off',
    component: ServerOffComponent,
    data: {
      title: 'Server is not reachable'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'base',
        loadChildren: './views/base/base.module#BaseModule'
      },
      {
        path: 'buttons',
        loadChildren: './views/buttons/buttons.module#ButtonsModule'
      },
      {
        path: 'charts',
        loadChildren: './views/chartjs/chartjs.module#ChartJSModule'
      },
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'icons',
        loadChildren: './views/icons/icons.module#IconsModule'
      },
      {
        path: 'notifications',
        loadChildren: './views/notifications/notifications.module#NotificationsModule'
      },
      {
        path: 'theme',
        loadChildren: './views/theme/theme.module#ThemeModule'
      },
      {
        path: 'widgets',
        loadChildren: './views/widgets/widgets.module#WidgetsModule'
      },
      {
        path: 'resources',
        loadChildren: './resources/resources.module#ResourcesModule'
      },
      {
        path: 'projects',
        loadChildren: './project/project.module#ProjectModule'
      },
      {
        path: 'migrate',
        loadChildren: './admin/admin.module#AdminModule'
      },
      {
        path: 'purchaseOrders',
        loadChildren: './po/po.module#PoModule'
      },
    ]
  },
  {path: '**', component: P404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
