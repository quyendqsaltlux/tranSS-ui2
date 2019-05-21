import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpecificCommentComponent} from './specific-comment/specific-comment.component';
import {OtherNoteListComponent} from './other-note-list/other-note-list.component';
import {OtherNoteComponent} from './other-note/other-note.component';
import {GeneralCommentListComponent} from './general-comment-list/general-comment-list.component';
import {EvaluationComponent} from './evaluation.component';
import {SpecificCommentViewComponent} from './specific-comment-view/specific-comment-view.component';
import {GeneralCommentComponent} from './general-comment/general-comment.component';
import {ShareModule} from '../share/share.module';

@NgModule({
  declarations: [
    SpecificCommentViewComponent,
    EvaluationComponent,
    GeneralCommentComponent,
    GeneralCommentListComponent,
    OtherNoteComponent,
    OtherNoteListComponent,
    SpecificCommentComponent
  ],
  imports: [
    ShareModule,
    CommonModule
  ],
  exports: [
    SpecificCommentViewComponent,
    EvaluationComponent,
    GeneralCommentComponent,
    GeneralCommentListComponent,
    OtherNoteComponent,
    OtherNoteListComponent,
    SpecificCommentComponent
  ],
  entryComponents: [SpecificCommentComponent]

})
export class EvaluationModule {
}
