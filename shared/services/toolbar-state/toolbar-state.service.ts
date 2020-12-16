import { from, Observable } from 'rxjs';
import { mergeMap, startWith } from 'rxjs/operators';

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
