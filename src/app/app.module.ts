import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {AppComponent} from './app.component';
import {DefaultLayoutComponent} from './containers';
import {P404Component} from './views/error/404.component';
import {P500Component} from './views/error/500.component';
import {LoginComponent} from './views/login/login.component';
import {RegisterComponent} from './views/register/register.component';
import {AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {ChartsModule} from 'ng2-charts/ng2-charts';
import {FormsModule} from '@angular/forms';
import {AuthModule} from './auth/auth.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ResourcesModule} from './resources/resources.module';
import {AccessDenyComponent} from './views/error/access-deny/access-deny.component';
import {JwtInterceptor} from './interceptor/jwtInterceptor';
import {ErrorInterceptor} from './interceptor/errorInterceptor';
import {GlobalConfig, ToastrModule} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DEFAULT_TIMEOUT, TimeoutInterceptor} from './interceptor/TimeoutInterceptor';
import {ServerOffComponent} from './views/error/server-off/server-off.component';
import {AuthGuard} from './gaurd/AuthGuard';
import {RoleGuard} from './gaurd/RoleGuard';
import {NgxLoadingModule} from 'ngx-loading';
import {LoaderComponent} from './containers/loader/loader.component';
import {LoaderInterceptorService} from './interceptor/LoaderInterceptorService';
import {AppRoutingModule} from './app-routing.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    AuthModule,
    HttpClientModule,
    ResourcesModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: false,
      newestOnTop: true,
      maxOpened: 3
    } as Partial<GlobalConfig>),
    NgxLoadingModule.forRoot({})
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    AccessDenyComponent,
    ServerOffComponent,
    LoaderComponent
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true},
    {provide: DEFAULT_TIMEOUT, useValue: 300000},
    AuthGuard, RoleGuard,
    {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
