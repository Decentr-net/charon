import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable()
export class NavigationService {
  constructor(private location: Location) {
  }

  public back(): void {
    this.location.back();
  }
}
