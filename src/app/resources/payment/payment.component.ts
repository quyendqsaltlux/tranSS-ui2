import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Payment} from '../../model/Payment';
import {NgForm} from '@angular/forms';
import {PaymentService} from '../../service/payment.service';
import {ToastrService} from 'ngx-toastr';
import {AttachmentComponent} from '../attachment/attachment.component';
import {getFileName} from '../../util/string-util';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {FileUploadService} from '../../service/file-upload.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @ViewChild('downloadLink') private downloadLink: ElementRef;
  payment = {} as Payment;
  @ViewChild('f') f: NgForm;
  @Output() saveOk: EventEmitter<any> = new EventEmitter();
  bsModalRef: BsModalRef;

  constructor(private paymentService: PaymentService,
              private toastr: ToastrService,
              private fileUploadService: FileUploadService,
              private modalService: BsModalService) {
  }

  ngOnInit() {
    if (!this.payment.id) {
      this.payment.type = 'KOREA';
    }
  }

  outSideSubmit() {
    this.f.onSubmit(event);
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }
    this.paymentService.save(this.payment).subscribe((resp) => {
      this.payment.id = resp.body.id;
      this.saveOk.emit(this.payment);
    }, (err) => {
      this.toastr.error(err.error.message);
    });
  }

  isFormValid() {
    return this.f.valid;
  }

  isKorea() {
    return this.payment.type === 'KOREA';
  }

  openAttachmentModal() {
    const initialState = {
      title: 'Upload attachment',
      folder: 'PAYMENT'
    };
    this.bsModalRef = this.modalService.show(AttachmentComponent, {initialState} as ModalOptions);
    this.bsModalRef.content.event.subscribe(result => {
      if (result && result.data) {
        this.payment.attachment = result.data;
      }
    });
  }

  downloadAttachment() {
    this.fileUploadService.downloadFile(this.payment.attachment).subscribe((resp) => {
      const url = URL.createObjectURL(resp);
      const link = this.downloadLink.nativeElement;
      link.href = url;
      link.download = getFileName(this.payment.attachment);
      link.click();
    });
  }

}
