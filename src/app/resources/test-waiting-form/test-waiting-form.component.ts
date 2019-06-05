import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {GlobalConfig, ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {TestWaitingService} from '../../service/test-waiting.service';
import {TestWaiting} from '../../model/TestWaiting';

@Component({
  selector: 'app-test-waiting-form',
  templateUrl: './test-waiting-form.component.html',
  styleUrls: ['./test-waiting-form.component.scss']
})
export class TestWaitingFormComponent implements OnInit {
  @ViewChild('downloadLink') private downloadLink: ElementRef;
  @ViewChild('f') candidateForm: NgForm;
  bsModalRef: BsModalRef;
  id = null;
  model: TestWaiting = {} as TestWaiting;

  constructor(private testWaitingService: TestWaitingService,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              public router: Router) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('testWaitingId');
    if (this.id && this.id > 0) {
      this.testWaitingService.findById(this.id).subscribe((resp) => {
        this.model = resp.body;
      });
    } else {
      console.log(this.model.testEvaluation);
      this.model.testEvaluation = 'UNEVALUATED';
    }
  }

  onSubmit() {
    this.testWaitingService.create(this.model).subscribe(
      (resp) => {
        this.toastr.success('Save successfully!');
        this.router.navigate(['/resources/test-waiting/list']);
      },
      (err) => {
        this.toastr.error('Fail to save!', '', {timeOut: 10000} as Partial<GlobalConfig>);
      });
  }
}
