import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AbilityCellService {

  abilityFilter = [];

  constructor() {
  }

  upDateAbilityFilters(newFilters) {
    this.abilityFilter = newFilters;
  }
}
