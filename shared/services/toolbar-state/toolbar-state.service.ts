import { from, Observable } from 'rxjs';
import { filter, mergeMap, startWith } from 'rxjs/operators';

import { BrowserLocalStorage } from '../browser-storage';

interface ToolbarState {
  enabled: boolean;
}

export class ToolbarStateService {
  private readonly toolbarStateStorage = BrowserLocalStorage
    .getInstance()
    .useSection<ToolbarState>('toolbar');

  private readonly enabledState$: Observable<boolean>;

  constructor() {
    this.enabledState$ = from(this.toolbarStateStorage.get('enabled'))
      .pipe(
        filter((state) => typeof state !== 'undefined'),
        startWith(true),
        mergeMap((state) => this.toolbarStateStorage.onChange('enabled')
          .pipe(
            startWith(state),
          )),
      );
  }

  public getEnabledState(): Observable<boolean> {
    return this.enabledState$;
  }

  public setEnabledState(state: boolean): void {
    this.toolbarStateStorage.set('enabled', state);
  }
}
