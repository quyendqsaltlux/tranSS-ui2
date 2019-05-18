import {Component, Input, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ProjectAssignmentService} from '../../service/project-assignment.service';

@Component({
  selector: 'app-project-assignment-list',
  templateUrl: './project-assignment-list.component.html',
  styleUrls: ['./project-assignment-list.component.scss']
})
export class ProjectAssignmentListComponent implements OnInit {
  @Input() projectId;
  @Input() projectCode;
  assignments: any = [];
  viewControl = {
    ableToChange: true
  };

  constructor(private  projectAssignmentService: ProjectAssignmentService,
              private toastr: ToastrService) {
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
      this.toastr.error('Fail to get list of assigments', '');
    });
  }

  onAssignDone(event) {
    this.getModelList();
  }
}
