import { browser, Tabs } from 'webextension-polyfill-ts';

export const openExtensionInNewTab = (relativeUrl: string): Promise<Tabs.Tab> => {
  return browser.tabs.create({
    url: browser.extension.getURL(`${window.location.pathname}${relativeUrl}`),
  });
};

export const isOpenedInTab = (): boolean => {
  return !browser.extension || browser.extension
    .getViews({ type: 'tab' })
    .some(extensionWindow => extensionWindow === window);
};

export const setExtensionIcon = (iconPaths: {[s:string]:string}): Promise<void> => {
  return browser.browserAction.setIcon({
    path: iconPaths,
  });
};
