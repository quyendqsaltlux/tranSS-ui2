import {NgModule} from '@angular/core';
import {ShareModule} from '../share/share.module';
import {PoRoutingModule} from './po-routing.module';
import {PoListComponent} from './po-list/po-list.component';
import {PoFormComponent} from './po-form/po-form.component';

@NgModule({
  declarations: [PoListComponent, PoFormComponent],
  imports: [
    PoRoutingModule,
    ShareModule
  ],
  entryComponents: [
    PoFormComponent
  ]
})
export class PoModule {
}
