import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FileNamePipe} from '../pipe/file-name.pipe';
import {LmToPipe} from '../pipe/lm-to.pipe';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {AlertModule, BsDatepickerModule, BsDropdownModule, CollapseModule, ModalModule, PaginationModule, PopoverModule, ProgressbarModule, TabsModule, TypeaheadModule} from 'ngx-bootstrap';
import {MyDatatableComponent} from './my-datatable/my-datatable.component';
import {EmployeeSearchComponent} from './employee-search/employee-search.component';
import {AssignmentStatusPipe} from '../pipe/assignmentStatus.pipe';
import {AutofocusDirective} from '../directive/autofocus.directive';
import {ProgressPipe} from '../pipe/progress.pipe';
import {BarRatingModule} from 'ngx-bar-rating';
import {ProjectProgressPipe} from '../pipe/project-progress.pipe';
import {MigrateTypePipe} from '../pipe/migrate-type.pipe';
import {AgGridModule} from 'ag-grid-angular';
import {ActionsColRendererComponent} from './ag-grid/actions-col-renderer.component';
import {UnitPipe} from '../pipe/unit.pipe';
import {AbilityCellComponent} from './ag-grid/ability-cell/ability-cell.component';
import {AbilityFilterComponent} from './ag-grid/ability-filter/ability-filter.component';
import {DateCellComponent} from './ag-grid/date-cell/date-cell.component';
import {EvaluationActionsCellComponent} from './ag-grid/evaluation-actions-cell/evaluation-actions-cell.component';
import {PoActionsCellComponent} from './ag-grid/po-actions-cell/po-actions-cell.component';
import {PercentCellComponent} from './ag-grid/percent-cell/percent-cell.component';
import {OptionsCellComponent} from './ag-grid/options-cell/options-cell.component';
import {AuditPoActionsCellComponent} from './ag-grid/audit-po-actions-cell/audit-po-actions-cell.component';
import {InvoiceActionsCellComponent} from './ag-grid/invoice-actions-cell/invoice-actions-cell.component';
import {TestWaitingEvaluatePipe} from '../pipe/test-waiting-evaluate.pipe';
import {ResourceActionsCellComponent} from './ag-grid/resource-actions-cell/resource-actions-cell.component';

@NgModule({
  declarations: [
    FileNamePipe,
    LmToPipe,
    ProgressPipe,
    AssignmentStatusPipe,
    MyDatatableComponent,
    EmployeeSearchComponent,
    AutofocusDirective,
    ProjectProgressPipe,
    MigrateTypePipe,
    ActionsColRendererComponent,
    ResourceActionsCellComponent,
    UnitPipe,
    AbilityCellComponent,
    AbilityFilterComponent,
    DateCellComponent,
    EvaluationActionsCellComponent,
    PoActionsCellComponent,
    PercentCellComponent,
    OptionsCellComponent,
    AuditPoActionsCellComponent,
    InvoiceActionsCellComponent,
    TestWaitingEvaluatePipe

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
    AgGridModule.withComponents([
      ActionsColRendererComponent,
      ResourceActionsCellComponent,
      AbilityCellComponent,
      AbilityFilterComponent,
      DateCellComponent,
      EvaluationActionsCellComponent,
      PoActionsCellComponent,
      PercentCellComponent,
      OptionsCellComponent,
      AuditPoActionsCellComponent,
      InvoiceActionsCellComponent
    ])
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
    AgGridModule,
    ActionsColRendererComponent,
    ResourceActionsCellComponent,
    AbilityCellComponent,
    AbilityFilterComponent,
    DateCellComponent,
    UnitPipe,
    PoActionsCellComponent,
    PercentCellComponent,
    OptionsCellComponent,
    AuditPoActionsCellComponent,
    InvoiceActionsCellComponent,
    TestWaitingEvaluatePipe
  ],
  entryComponents: [
    EmployeeSearchComponent
  ]
})
export class ShareModule {
}
