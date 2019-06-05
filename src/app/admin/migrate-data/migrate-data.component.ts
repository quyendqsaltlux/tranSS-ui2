import {Component, OnInit} from '@angular/core';
import {MigrateService} from '../../service/migrate.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-migrate-data',
  templateUrl: './migrate-data.component.html',
  styleUrls: ['./migrate-data.component.scss']
})
export class MigrateDataComponent implements OnInit {
  modelList = [];

  constructor(private migrateService: MigrateService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getAll();
  }

  migrateResource() {
    this.migrateService.migrateResource().subscribe((resp) => {
      this.modelList = resp.body;
    }, (err) => {
      this.toastr.error(err.error.message);
    });
  }

  migrateUser() {
    this.migrateService.migrateUser().subscribe((resp) => {
      this.modelList = resp.body;
    }, (err) => {
      this.toastr.error(err.error.message);
    });
  }

  migrateFinishedProject() {
    this.migrateService.migrateFinishedProject().subscribe((resp) => {
      this.modelList = resp.body;
    }, (err) => {
      this.toastr.error(err.error.message);
    });
  }

  migrateOngoingProject() {
    this.migrateService.migrateOngoingProject().subscribe((resp) => {
      this.modelList = resp.body;
    }, (err) => {
      this.toastr.error(err.error.message);
    });
  }

  migrateKoreaPayment() {
    this.migrateService.migrateKoreaPayment().subscribe((resp) => {
      this.modelList = resp.body;
    }, (err) => {
      this.toastr.error(err.error.message);
    });
  }

  migrateOverseaPayment() {
    this.migrateService.migrateOverseaPayment().subscribe((resp) => {
      this.modelList = resp.body;
    }, (err) => {
      this.toastr.error(err.error.message);
    });
  }

  migrateAssignmentFromFile() {
    this.migrateService.migrateAssignmentFromFile().subscribe((resp) => {
      this.modelList = resp.body;
    }, (err) => {
      this.toastr.error(err.error.message);
    });
  }

  migrateTestWaitingFromFile() {
    this.migrateService.migrateTestWaitingFromFile().subscribe((resp) => {
      this.modelList = resp.body;
    }, (err) => {
      this.toastr.error(err.error.message);
    });
  }

  getAll() {
    this.migrateService.getAll().subscribe((resp) => {
      this.modelList = resp.body;
    });
  }

  isDone(migrateType) {
    return this.modelList.findIndex((item) => item.type === migrateType) >= 0;
  }
}
