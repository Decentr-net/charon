import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  constructor(private location: Location) {
  }

  public getPreviousUrl() {
    this.location.back();
  }
}
