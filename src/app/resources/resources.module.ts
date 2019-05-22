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
import {GeneralCommentComponent} from '../evaluation/general-comment/general-comment.component';
import {OtherNoteComponent} from '../evaluation/other-note/other-note.component';
import {EvaluationModule} from '../evaluation/evaluation.module';

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
  ],
  imports: [
    ResourcesRoutingModule,
    ShareModule,
    EvaluationModule
  ],
  entryComponents: [AttachmentComponent, GeneralCommentComponent, OtherNoteComponent],
})
export class ResourcesModule {
}
