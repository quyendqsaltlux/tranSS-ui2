import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CandidateFormComponent} from './candidate-form/candidate-form.component';
import {AbilitiesComponent} from './abilities/abilities.component';
import {ProjectHistoryComponent} from './project-history/project-history.component';
import {AuthGuard} from '../gaurd/AuthGuard';
import {RoleGuard} from '../gaurd/RoleGuard';
import {ResourceSearchComponent} from './resource-search/resource-search.component';
import {TestWaitingFormComponent} from './test-waiting-form/test-waiting-form.component';
import {TestWaitingListComponent} from './test-waiting-list/test-waiting-list.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RoleGuard],
    data: {
      title: 'Resource Management',
      roles: ['ROLE_ADMIN', 'ROLE_PM', 'ROLE_RM']
    },
    children: [
      {path: '', redirectTo: 'search', pathMatch: 'full'},
      {path: 'search', component: ResourceSearchComponent, data: {title: 'List'}},
      {path: 'new', component: CandidateFormComponent, data: {title: 'New'}},
      {path: 'edit/:id', component: CandidateFormComponent, data: {title: 'Edit'}},
      {path: ':candidateId/abilities', component: AbilitiesComponent, data: {title: 'Rates'}},
      {path: ':candidateId/project-history', component: ProjectHistoryComponent, data: {title: 'Project history'}},
      {path: 'test-waiting/list', component: TestWaitingListComponent, data: {title: 'Unevaluated resource list'}},
      {path: 'test-waiting/edit/:testWaitingId', component: TestWaitingFormComponent, data: {title: 'Unevaluated resource form'}},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourcesRoutingModule {
}
