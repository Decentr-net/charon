import { AfterViewChecked, ChangeDetectorRef, Injectable } from '@angular/core';

/**
 * Based on and adapted from: https://stackoverflow.com/questions/38442091/how-to-do-responsive-components-in-angular2
 */
@Injectable()
export class MatchMediaService {

  rules = {
    small: '(max-width: 767px)',
    large: '(min-width: 768px)',
  };

  smallMediaQueryList: MediaQueryList;
  largeMediaQueryList: MediaQueryList;

  constructor() {
    this.largeMediaQueryList = window.matchMedia(this.rules.large);
    this.smallMediaQueryList = window.matchMedia(this.rules.small);
  }

  isSmall(): boolean {
    return this.smallMediaQueryList.matches;
  }

  isLarge(): boolean {
    return this.largeMediaQueryList.matches;
  }
}
