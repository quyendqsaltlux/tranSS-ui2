import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'app-options-cell',
  templateUrl: './options-cell.component.html',
  styleUrls: ['./options-cell.component.scss']
})
export class OptionsCellComponent implements ICellRendererAngularComp {
  public params: any;
  options = [];
  renderField: '';
  selectedOption;

  agInit(params: any): void {
    this.params = params;
    this.renderField = this.params.renderField;
    this.options = this.params.options;
  }

  refresh(): boolean {
    return false;
  }

  onOptionChanged(event) {

  }
}
