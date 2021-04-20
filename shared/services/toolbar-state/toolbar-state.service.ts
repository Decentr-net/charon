import { defer, Observable } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, startWith } from 'rxjs/operators';

import { BrowserLocalStorage } from '../browser-storage';

interface ToolbarState {
  enabled: boolean;
}

const TOOLBAR_DEFAULT_ENABLED = false;

export class ToolbarStateService {
  private readonly toolbarStateStorage = BrowserLocalStorage
    .getInstance()
    .useSection<ToolbarState>('toolbar');

  private readonly enabledState$: Observable<boolean>;

  constructor() {
    this.enabledState$ = defer(() => this.toolbarStateStorage.get('enabled')).pipe(
      mergeMap((state) => this.toolbarStateStorage.onChange('enabled').pipe(
        startWith(state),
      )),
      map((state) => state || TOOLBAR_DEFAULT_ENABLED),
      distinctUntilChanged(),
    );
  }

  public getEnabledState(): Observable<boolean> {
    return this.enabledState$;
  }

  public setEnabledState(state: boolean): void {
    this.toolbarStateStorage.set('enabled', state);
  }
}
