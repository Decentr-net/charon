import { browser, Tabs } from 'webextension-polyfill-ts';
import { coerceArray } from '@angular/cdk/coercion';

export const openCharonPage = (route: string | string[]): Promise<Tabs.Tab> => {
  return browser.tabs.create({
    url: browser.extension.getURL(`charon/index.html#/${coerceArray(route).join('/')}`),
  });
}
