import {NgModule} from '@angular/core';
import {CandidateFormComponent} from './candidate-form/candidate-form.component';
import {ResourcesRoutingModule} from './resources-routing.module';
import {AbilityComponent} from './ability/ability.component';
import {CandidateTypePipe} from '../pipe/candidate-type.pipe';
import {AttachmentComponent} from './attachment/attachment.component';
import {FormWrapperComponent} from './form-wrapper/form-wrapper.component';
import {AbilitiesComponent} from './abilities/abilities.component';
import {ShareModule} from '../share/share.module';
import {ProjectHistoryComponent} from './project-history/project-history.component';
import {PaymentComponent} from './payment/payment.component';
import {GeneralCommentComponent} from '../evaluation/general-comment/general-comment.component';
import {OtherNoteComponent} from '../evaluation/other-note/other-note.component';
import {EvaluationModule} from '../evaluation/evaluation.module';
import {ResourceSearchComponent} from './resource-search/resource-search.component';
import {TestWaitingFormComponent} from './test-waiting-form/test-waiting-form.component';
import {TestWaitingListComponent} from './test-waiting-list/test-waiting-list.component';
import {ProjectDoingComponent} from './project-doing/project-doing.component';

@NgModule({
  declarations: [
    CandidateFormComponent,
    AbilityComponent,
    CandidateTypePipe,
    AttachmentComponent,
    FormWrapperComponent,
    AbilitiesComponent,
    ProjectHistoryComponent,
    PaymentComponent,
    ResourceSearchComponent,
    TestWaitingFormComponent,
    TestWaitingListComponent,
    ProjectDoingComponent
  ],
  imports: [
    ResourcesRoutingModule,
    ShareModule,
    EvaluationModule
  ],
  entryComponents: [
    AttachmentComponent,
    GeneralCommentComponent,
    OtherNoteComponent,
    ProjectDoingComponent],
})
export class ResourcesModule {
}
