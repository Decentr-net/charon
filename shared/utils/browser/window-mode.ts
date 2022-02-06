import * as Browser from 'webextension-polyfill';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

export const POPUP_TAB_QUERY_PARAM = 'popupTab';

export const isOpenedInPopupTab = (): boolean => {
  const queryParamsString = (location.hash.split('?')[1]);
  const searchParams = new URLSearchParams(queryParamsString);
  return coerceBooleanProperty(searchParams.get(POPUP_TAB_QUERY_PARAM));
};

export const isOpenedInTab = (): boolean => {
  return (!Browser.extension || Browser.extension
    .getViews({ type: 'tab' })
    .some(extensionWindow => extensionWindow === window))
    && !isOpenedInPopupTab();
};

export const isOpenedInPopup = (): boolean => {
  return !isOpenedInTab() && !isOpenedInPopupTab();
};
