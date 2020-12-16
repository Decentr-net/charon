import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Observable } from 'rxjs';
import { ToolbarStateService } from '../../../../shared/services/toolbar-state';
import { tap } from 'rxjs/operators';

const toolbarStateService = new ToolbarStateService();

const enum SessionStorageKey {
  Closed = 'closed',
}

export const saveToolbarClosed = (): void => {
  sessionStorage.setItem(SessionStorageKey.Closed, JSON.stringify(true));
}

export const isToolbarClosed = (): boolean => {
  const isClosedKeyValue = sessionStorage.getItem(SessionStorageKey.Closed);
  return coerceBooleanProperty(isClosedKeyValue);
}

export const getToolbarEnabledState = (): Observable<boolean> => {
  return toolbarStateService.getEnabledState().pipe(
    tap(console.log),
  );
}
