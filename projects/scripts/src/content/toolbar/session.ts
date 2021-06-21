import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Observable } from 'rxjs';
import { browser } from 'webextension-polyfill-ts';

import { ToolbarStateService } from '../../../../../shared/services/toolbar-state';

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
  return toolbarStateService.getEnabledState();
}

export const getExtensionDisabledEvent = () => {
  return new Observable((subscriber) => {
    const port = browser.runtime.connect();
    const callback = () => subscriber.next();
    port.onDisconnect.addListener(callback);

    return () => port.onDisconnect.removeListener(callback);
  });
}
