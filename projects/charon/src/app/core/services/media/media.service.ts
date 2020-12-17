import { Injectable } from '@angular/core';

@Injectable()
export class MediaService {

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
