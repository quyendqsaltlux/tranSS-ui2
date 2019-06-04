import {Component, OnInit, ViewChild} from '@angular/core';
import {AuditPosComponent} from '../audit-pos/audit-pos.component';

@Component({
  selector: 'app-invoice-wrapper',
  templateUrl: './invoice-wrapper.component.html',
  styleUrls: ['./invoice-wrapper.component.scss']
})
export class InvoiceWrapperComponent implements OnInit {

  @ViewChild('auditPos') auditPos: AuditPosComponent;

  constructor() {
  }

  ngOnInit() {
  }

  onInvoiceDeleted(event) {
    this.auditPos.getModelList();
  }
}
