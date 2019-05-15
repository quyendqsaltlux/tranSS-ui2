import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ProjectService} from '../../service/project.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {NgForm} from '@angular/forms';
import {focusDuplicatedFields} from '../../util/dom-util';
import {EmployeeSearchComponent} from '../../share/employee-search/employee-search.component';
import {combineLatest, Subscription} from 'rxjs';
import {O, X} from '../../AppConstant';
import * as _ from 'lodash';
import {Project} from '../../model/Project';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss']
})
export class ProjectFormComponent implements OnInit {
  @ViewChild('f') candidateForm: NgForm;
  bsModalRef: BsModalRef;
  subscriptions: Subscription[] = [];

  id = null;
  model: Project = <Project>{};

  constructor(private projectService: ProjectService,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              public router: Router,
              private modalService: BsModalService,
              private changeDetection: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.projectService.findById(this.id).subscribe((resp) => {
        this.model = resp.body;
        this.extractModelFromApi(this.model);
      });
    }
  }

  extractModelFromApi(model) {
    model.reference = model.reference === X;
    model.termbase = model.termbase === X;
    model.instruction = model.instruction === X;
  }

  buildParam(model) {
    const param = _.cloneDeep(model);
    param.reference = param.reference === true ? X : O;
    param.termbase = param.termbase === true ? X : O;
    param.instruction = param.instruction === true ? X : O;
    return param;
  }

  onSubmit() {
    this.saveCandidate();
  }

  saveCandidate() {
    const param = this.buildParam(this.model);
    this.projectService.create(param).subscribe(
      (resp) => {
        this.toastr.success('Save successfully!');
        this.router.navigate(['/projects']);
      },
      (err) => {
        if (err && err.status === 409 && err.error && err.error.apierror && err.error.apierror.subErrors) {
          const duplicatedColumns = err.error.apierror.subErrors[0].duplicatedColumns;
          focusDuplicatedFields(duplicatedColumns, this.candidateForm);
        } else {
          this.toastr.error('Fail to save!', '', {timeOut: 10000});
        }
      });
  }

  openEmployeesModal(isKoreaPM, _title) {
    const _combine = combineLatest(
      this.modalService.onHide,
      this.modalService.onHidden
    ).subscribe(() => this.changeDetection.markForCheck());

    this.subscriptions.push(
      this.modalService.onHide.subscribe((reason: string) => {
      })
    );
    this.subscriptions.push(
      this.modalService.onHidden.subscribe((reason: string) => {
        this.onModalClose(this.bsModalRef.content, isKoreaPM);
        this.unsubscribe();
      })
    );

    this.subscriptions.push(_combine);

    const initialState = {
      title: _title
    };
    this.bsModalRef = this.modalService.show(EmployeeSearchComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Cancel';
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = [];
  }

  onModalClose(modalContent, isKoreaPM) {
    const selectedPM = modalContent.selectedOption;
    const isConfirmed = modalContent.isConfirmed;
    if (isConfirmed && selectedPM && selectedPM.code) {
      this.model[isKoreaPM] = selectedPM.code;
    }
  }
}
