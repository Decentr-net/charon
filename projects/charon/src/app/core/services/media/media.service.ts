import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { distinctUntilChanged, map, mapTo } from 'rxjs/operators';

@Injectable()
export class MediaService {

  rules = {
    small: '(max-width: 767px)',
    large: '(min-width: 768px)',
  };

  smallMediaQueryList: MediaQueryList;
  largeMediaQueryList: MediaQueryList;

  public readonly mediaChanged$: Observable<void>;

  constructor() {
    this.largeMediaQueryList = window.matchMedia(this.rules.large);
    this.smallMediaQueryList = window.matchMedia(this.rules.small);

    this.mediaChanged$ = fromEvent(window, 'resize').pipe(
      map(() => this.isLarge()),
      distinctUntilChanged(),
      mapTo(void 0),
    );
  }

  isSmall(): boolean {
    return this.smallMediaQueryList.matches;
  }

  isLarge(): boolean {
    return this.largeMediaQueryList.matches;
  }
}
