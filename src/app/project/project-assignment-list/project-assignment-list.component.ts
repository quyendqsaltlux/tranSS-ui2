import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ProjectAssignmentService} from '../../service/project-assignment.service';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';

@Component({
  selector: 'app-project-assignment-list',
  templateUrl: './project-assignment-list.component.html',
  styleUrls: ['./project-assignment-list.component.scss']
})
export class ProjectAssignmentListComponent implements OnInit {
  @ViewChild('template') template: TemplateRef<any>;
  modalRef: BsModalRef;
  @Input() projectId;
  @Input() projectCode;
  @Input() isOwnerOrNotAssign;
  assignments: any = [];
  viewControl = {
    ableToChange: true
  };
  deleteId = -1;

  constructor(private  projectAssignmentService: ProjectAssignmentService,
              private toastr: ToastrService,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.getModelList();
  }

  onNewResource() {
    if (this.hasNewAssignment()) {
      return;
    }
    const newAss = {} as any;
    this.assignments.unshift(newAss);
  }

  hasNewAssignment() {
    return this.assignments.findIndex((assignment) => assignment.id == null) >= 0;
  }

  getModelList() {
    this.projectAssignmentService.getListByProject(this.projectId).subscribe((resp) => {
      if (resp && resp.body) {
        this.assignments = resp.body.list;
        this.viewControl.ableToChange = resp.body.ableToChange;
      }
    }, (err) => {
      this.toastr.error('Fail to get list of assignments', '');
    });
  }

  onAssignDone(event) {
    this.getModelList();
  }

  confirmDelete(): void {
    this.modalRef.hide();
    if (this.deleteId < 0) {
      return;
    }
    this.projectAssignmentService.deleteById(this.deleteId).subscribe((resp) => {
        this.toastr.success('Delete successfully!');
        this.getModelList();
      },
      (error1 => {
        if (error1.status === 409) {
          this.toastr.error('PO need to be deleted first!');
          return;
        }
        this.toastr.error('Fail to delete!');
      }));
  }

  declineDelete(): void {
    this.modalRef.hide();
  }

  onResourceDelete(index) {
    if (this.assignments[index].id == null) {
      this.assignments.splice(index, 1);
      return;
    }
    this.deleteId = this.assignments[index].id;
    this.modalRef = this.modalService.show(this.template, {class: 'modal-sm'} as ModalOptions);
  }

}
