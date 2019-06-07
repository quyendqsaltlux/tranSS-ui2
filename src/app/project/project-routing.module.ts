import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProjectsComponent} from './projects/projects.component';
import {ProjectFormComponent} from './project-form/project-form.component';
import {ProjectAssignmentListComponent} from './project-assignment-list/project-assignment-list.component';
import {ProjectAssignmentComponent} from './project-assignment/project-assignment.component';
import {AuthGuard} from '../gaurd/AuthGuard';
import {RoleGuard} from '../gaurd/RoleGuard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      title: 'Project Management',
      roles: ['ROLE_ADMIN', 'ROLE_PM', 'ROLE_RM']
    },
    children: [
      {path: '', redirectTo: 'list', pathMatch: 'full'},
      {path: 'list', component: ProjectsComponent, data: {title: 'List'}},
      {
        path: 'new', component: ProjectFormComponent,
        data: {
          title: 'New'
        }
      },
      {path: 'edit/:id', component: ProjectFormComponent, data: {title: 'Edit'}},
      {path: 'assignments', component: ProjectAssignmentListComponent, data: {title: 'Project assignments'}},
      {path: ':id/assign', component: ProjectAssignmentComponent, data: {title: 'Assign resources to project'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {
}
