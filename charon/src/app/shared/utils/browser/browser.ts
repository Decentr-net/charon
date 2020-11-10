import { browser, Tabs } from 'webextension-polyfill-ts';

export const openExtensionInNewTab = (relativeUrl: string): Promise<Tabs.Tab> => {
  return browser.tabs.create({
    url: browser.extension.getURL(`index.html#/${relativeUrl}`),
  });
};

export const isOpenedInTab = (): boolean => {
  return !browser.extension || browser.extension
    .getViews({ type: 'tab' })
    .some(extensionWindow => extensionWindow === window);
};
