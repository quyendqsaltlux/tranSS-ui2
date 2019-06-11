import {NgModule} from '@angular/core';
import {ProjectsComponent} from './projects/projects.component';
import {ProjectFormComponent} from './project-form/project-form.component';
import {ShareModule} from '../share/share.module';
import {ProjectRoutingModule} from './project-routing.module';
import {ProjectAssignmentListComponent} from './project-assignment-list/project-assignment-list.component';
import {ProjectAssignmentComponent} from './project-assignment/project-assignment.component';
import {AssignmentInfoComponent} from './assignment-info/assignment-info.component';
import {EvaluationModule} from '../evaluation/evaluation.module';
import {ResourceSearchComponent} from './resource-search/resource-search.component';
import {PoModule} from "../po/po.module";

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectFormComponent,
    ProjectAssignmentListComponent,
    ProjectAssignmentComponent,
    AssignmentInfoComponent,
    ResourceSearchComponent
  ],
  imports: [
    ProjectRoutingModule,
    ShareModule,
    EvaluationModule,
    PoModule
  ]
})
export class ProjectModule {
}
