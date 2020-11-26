import { coerceBooleanProperty } from '@angular/cdk/coercion';

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
