import {Component, OnInit} from '@angular/core';
import {BsModalRef, TypeaheadMatch} from 'ngx-bootstrap';
import {EmployeeService} from '../../service/employee.service';
import {Observable} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';

@Component({
  selector: 'app-employee-search',
  templateUrl: './employee-search.component.html',
  styleUrls: ['./employee-search.component.scss']
})
export class EmployeeSearchComponent implements OnInit {
  title: string;
  closeBtnName: string;
  list: any[] = [];
  asyncSelected: string;
  typeaheadLoading: boolean;
  dataSource: Observable<any>;
  noResult = false;
  selectedOption: any;
  isConfirmed = false;
  AVATAR_SIZE_SLIM = 44;
  AVATAR_SIZE_MEDIUM = 70;

  constructor(public bsModalRef: BsModalRef,
              private employeeService: EmployeeService) {
    this.dataSource = Observable.create((observer: any) => {
      // Runs on every search
      observer.next(this.asyncSelected);
    })
      .pipe(
        mergeMap((token: string) => this.getEmployeeAsObserble(token))
      );
  }

  onConfirm() {
    this.isConfirmed = true;
    this.bsModalRef.hide();
  }

  onCancel() {
    this.isConfirmed = false;
    this.bsModalRef.hide();
  }

  ngOnInit() {
  }

  getEmployeeAsObserble(keyword): Observable<any> {
    return this.employeeService.findUserByUsernameLike(keyword).pipe(
      map(resp => resp.body),

    );
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  typeaheadOnSelect(e: TypeaheadMatch): void {
  }

  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }

  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;
  }
}
