import {NgModule} from '@angular/core';
import {CandidateFormComponent} from './candidate-form/candidate-form.component';
import {CandidateListComponent} from './candidate-list/candidate-list.component';
import {ResourcesRoutingModule} from './resources-routing.module';
import {AbilityComponent} from './ability/ability.component';
import {CandidateTypePipe} from '../pipe/candidate-type.pipe';
import {AttachmentComponent} from './attachment/attachment.component';
import {FormWrapperComponent} from './form-wrapper/form-wrapper.component';
import {AbilitiesComponent} from './abilities/abilities.component';
import {ShareModule} from '../share/share.module';
import {ProjectHistoryComponent} from './project-history/project-history.component';
import {PaymentComponent} from './payment/payment.component';
import {SpecificCommentViewComponent} from './evaluation/specific-comment-view/specific-comment-view.component';
import {EvaluationComponent} from './evaluation/evaluation.component';
import {GeneralCommentComponent} from './evaluation/general-comment/general-comment.component';
import {GeneralCommentListComponent} from './evaluation/general-comment-list/general-comment-list.component';

@NgModule({
  declarations: [
    CandidateFormComponent,
    CandidateListComponent,
    AbilityComponent,
    CandidateTypePipe,
    AttachmentComponent,
    FormWrapperComponent,
    AbilitiesComponent,
    ProjectHistoryComponent,
    PaymentComponent,
    SpecificCommentViewComponent,
    EvaluationComponent,
    GeneralCommentComponent,
    GeneralCommentListComponent,
  ],
  imports: [
    ResourcesRoutingModule,
    ShareModule
  ],
  entryComponents: [AttachmentComponent, GeneralCommentComponent],
})
export class ResourcesModule {
}
