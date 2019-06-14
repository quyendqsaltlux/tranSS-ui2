import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {CandidateService} from '../../service/candidate.service';
import {GlobalConfig, ToastrService} from 'ngx-toastr';
import {focusDuplicatedFields} from '../../util/dom-util';
import {ActivatedRoute, Router} from '@angular/router';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {AttachmentComponent} from '../attachment/attachment.component';
import {getFileName} from '../../util/string-util';
import {Candidate} from '../../model/Candidate';
import {PaymentComponent} from '../payment/payment.component';
import {FileUploadService} from '../../service/file-upload.service';
import {CV_FOLDER, DIPLOMA_FOLDER, OTHER_ATTACHMENTS_FOLDER} from '../../AppConstant';

@Component({
  selector: 'app-candidate-form',
  templateUrl: './candidate-form.component.html',
  styleUrls: ['./candidate-form.component.scss']
})
export class CandidateFormComponent implements OnInit {
  @ViewChild('downloadLink') private downloadLink: ElementRef;
  @ViewChild('f') candidateForm: NgForm;
  @ViewChild('payment') paymentComponent: PaymentComponent;
  bsModalRef: BsModalRef;
  id = null;
  model: Candidate = {} as Candidate;

  constructor(private candidateService: CandidateService,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              public router: Router,
              private fileUploadService: FileUploadService,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.candidateService.findById(this.id).subscribe((resp) => {
        this.model = resp.body;
        this.model.attachments = resp.body.attachments ? resp.body.attachments.split(',') : [];
        if (this.model.payment) {
          this.paymentComponent.payment = this.model.payment;
        }
      });
    } else {
      this.model.currency = 'USD';
      this.model.grade = 'A';
      this.model.type = 'TF';
    }
  }

  onSubmit() {
    this.paymentComponent.outSideSubmit();
    // this.saveCandidate();
  }

  buildParams(model) {
    const params = {...model};
    params['paymentId'] = model.payment ? model.payment.id : null;
    params['attachments'] = model.attachments ? model.attachments.join(',') : null;
    delete params.payment;
    return params;
  }

  saveCandidate() {
    this.candidateService.create(this.buildParams(this.model)).subscribe(
      (resp) => {
        this.toastr.success('Save successfully!');
        this.router.navigate(['/resources/' + resp.body.id + '/abilities']);
      },
      (err) => {
        if (err && err.status === 409 && err.error && err.error.apierror && err.error.apierror.subErrors) {
          const duplicatedColumns = err.error.apierror.subErrors[0].duplicatedColumns;
          focusDuplicatedFields(duplicatedColumns, this.candidateForm);
        } else {
          this.toastr.error('Fail to save!', '', {timeOut: 10000} as Partial<GlobalConfig>);
        }
      });
  }

  openCvModal() {
    const initialState = {
      title: 'Upload CV',
      folder: CV_FOLDER
    };
    this.bsModalRef = this.modalService.show(AttachmentComponent, {initialState} as ModalOptions);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.event.subscribe(result => {
      if (result && result.data) {
        this.model.cv = result.data;
      }
    });
  }

  openAttachmentModal() {
    const initialState = {
      title: 'Upload Attachments',
      folder: OTHER_ATTACHMENTS_FOLDER,
      isMultiple: true,
    };
    this.bsModalRef = this.modalService.show(AttachmentComponent, {initialState} as ModalOptions);
    this.bsModalRef.content.isMultiple = true;
    this.bsModalRef.content.event.subscribe(result => {
      if (result && result.data) {
        if (!this.model.attachments) {
          this.model.attachments = [];
          this.model.attachments.push(result.data);
        } else if (result.data && this.model.attachments.findIndex((_item) => _item === result.data) < 0) {
          this.model.attachments.push(result.data);
        }
      }
    });
  }

  openDiplomaModal() {
    const initialState = {
      title: 'Upload Diploma',
      folder: DIPLOMA_FOLDER
    };
    this.bsModalRef = this.modalService.show(AttachmentComponent, {initialState} as ModalOptions);
    this.bsModalRef.content.event.subscribe(result => {
      if (result && result.data) {
        this.model.diploma = result.data;
      }
    });
  }

  downloadCv() {
    this.fileUploadService.downloadFile(this.model.cv).subscribe((resp) => {
      const url = URL.createObjectURL(resp);
      const link = this.downloadLink.nativeElement;
      link.href = url;
      link.download = getFileName(this.model.cv);
      link.click();
    }, (errors) => {
      this.toastr.error('Not found!');
    });
  }

  downloadDiploma() {
    this.fileUploadService.downloadFile(this.model.diploma).subscribe((resp) => {
      const url = URL.createObjectURL(resp);
      const link = this.downloadLink.nativeElement;
      link.href = url;
      link.download = getFileName(this.model.diploma);
      link.click();
    }, (errors) => {
      this.toastr.error('Not found!');
    });
  }

  downloadAttachments(file) {
    this.fileUploadService.downloadFile(file).subscribe((resp) => {
      const url = URL.createObjectURL(resp);
      const link = this.downloadLink.nativeElement;
      link.href = url;
      link.download = getFileName(file);
      link.click();
    }, (errors) => {
      this.toastr.error('Not found!');
    });
  }

  _onPaymentSaved(payment) {
    this.model.payment = payment;
    this.saveCandidate();
  }
}
