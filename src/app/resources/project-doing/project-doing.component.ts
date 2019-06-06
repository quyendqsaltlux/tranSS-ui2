import {Component, OnInit} from '@angular/core';
import {ProjectAssignmentService} from '../../service/project-assignment.service';

@Component({
  selector: 'app-project-doing',
  templateUrl: './project-doing.component.html',
  styleUrls: ['./project-doing.component.scss']
})
export class ProjectDoingComponent implements OnInit {
  candidateId = null;
  ignoreFilter = true;
  modelList = [];
  keyWord: string;
  page = 1;
  size = 10;
  numPages = 0;
  totalItems = 0;
  sortConfig: {
    field: string,
    order: string
  } = {
    field: null,
    order: null
  };
  filter = [];

  constructor(private  assignmentService: ProjectAssignmentService) {
  }

  ngOnInit() {
  }

  getModelList() {
    this.assignmentService.search(this.candidateId, this.page, this.size, this.keyWord,
      this.sortConfig.field, this.sortConfig.order, this.filter, []
    )
      .subscribe((resp => {
        if (!resp || !resp.body) {
          this.modelList = [];
          this.totalItems = 0;
          this.numPages = 0;
          return;
        }
        this.modelList = resp.body.content;
        this.totalItems = resp.body.totalElements;
        this.numPages = resp.body.totalPages;

        this.ignoreFilter = false;
      }));
  }
}
