import * as Browser from 'webextension-polyfill';

export enum BrowserType {
  Chrome = 'Chrome',
  Decentr = 'Decentr',
  Edge = 'Edge',
  Firefox = 'Firefox',
  IE = 'IE',
  Opera = 'Opera',
  Safari = 'Safari',
  Samsung = 'Samsung',
  Unknown = 'Unknown',
}

export const openExtensionInNewTab = (relativeUrl: string): Promise<Browser.Tabs.Tab> => {
  return Browser.tabs.create({
    url: Browser.runtime.getURL(`${window.location.pathname}${relativeUrl}`),
  });
};

export const detectBrowser = (): BrowserType => {
  const userAgent = window.navigator.userAgent;

  if (userAgent.indexOf('Decentr') > -1) {
    return BrowserType.Decentr;
  }


  if (userAgent.indexOf('Firefox') > -1) {
    return BrowserType.Firefox;
  }

  if (userAgent.indexOf('SamsungBrowser') > -1) {
    return BrowserType.Samsung;
  }

  if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
    return BrowserType.Opera;
  }

  if (userAgent.indexOf('Trident') > -1) {
    return BrowserType.IE;
  }

  if (userAgent.indexOf('Edge') > -1) {
    return BrowserType.Edge;
  }

  if (userAgent.indexOf('Chrome') > -1) {
    return BrowserType.Chrome;
  }

  if (userAgent.indexOf('Safari') > -1) {
    return BrowserType.Safari;
  }

  return BrowserType.Unknown;
};
