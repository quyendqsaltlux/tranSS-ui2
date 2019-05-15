import {Component, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from './loader.service';
import {Subscription} from 'rxjs/index';

const PrimaryWhite = '#dd0031';
const SecondaryGrey = '#006ddd';

export interface LoaderState {
  show: boolean;
}

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit, OnDestroy {
  public _primaryColour = PrimaryWhite;
  public _secondaryColour = SecondaryGrey;
  show = false;
  private subscription: Subscription;

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: LoaderState) => {
        this.show = state.show;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
