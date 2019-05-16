import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileNamePipe} from '../pipe/file-name.pipe';
import {LmToPipe} from '../pipe/lm-to.pipe';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {AlertModule, BsDatepickerModule, BsDropdownModule, CollapseModule, ModalModule, PaginationModule, PopoverModule, ProgressbarModule, TabsModule, TypeaheadModule} from 'ngx-bootstrap';
import {MyDatatableComponent} from './my-datatable/my-datatable.component';
import {EmployeeSearchComponent} from './employee-search/employee-search.component';
import {CandidateSearchComponent} from './candidate-search/candidate-search.component';
import {AssignmentStatusPipe} from '../pipe/assignmentStatus.pipe';
import {AutofocusDirective} from '../directive/autofocus.directive';
import {ProgressPipe} from '../pipe/progress.pipe';
import {BarRatingModule} from 'ngx-bar-rating';
import {ProjectProgressPipe} from '../pipe/project-progress.pipe';
import {MigrateTypePipe} from '../pipe/migrate-type.pipe';
import {AgGridModule} from 'ag-grid-angular';

@NgModule({
  declarations: [
    FileNamePipe,
    LmToPipe,
    ProgressPipe,
    AssignmentStatusPipe,
    MyDatatableComponent,
    EmployeeSearchComponent,
    CandidateSearchComponent,
    AutofocusDirective,
    ProjectProgressPipe,
    MigrateTypePipe
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    CollapseModule.forRoot(),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TabsModule,
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    ProgressbarModule.forRoot(),
    AlertModule.forRoot(),
    BarRatingModule,
    AgGridModule.withComponents([])
  ],
  exports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    CollapseModule,
    PaginationModule,
    BsDropdownModule,
    ModalModule,
    PopoverModule,
    TabsModule,
    FileNamePipe,
    LmToPipe,
    ProgressPipe,
    AssignmentStatusPipe,
    MyDatatableComponent,
    BsDatepickerModule,
    TypeaheadModule,
    ProgressbarModule,
    AutofocusDirective,
    BarRatingModule,
    ProjectProgressPipe,
    AlertModule,
    MigrateTypePipe,
    AgGridModule
  ],
  entryComponents: [
    EmployeeSearchComponent
  ]
})
export class ShareModule {
}
