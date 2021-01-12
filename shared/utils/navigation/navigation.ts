import { coerceArray } from '@angular/cdk/coercion';
import { browser, Tabs } from 'webextension-polyfill-ts';

export const getCharonPageUrl = (route: string | string[]): string => {
  return browser.extension.getURL(`charon/index.html#/${coerceArray(route).join('/')}`)
}

export const openCharonPage = (route: string | string[]): Promise<Tabs.Tab> => {
  return browser.tabs.create({
    url: getCharonPageUrl(route),
  });
}
