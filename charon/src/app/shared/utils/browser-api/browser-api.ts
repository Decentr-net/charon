const apis = [
  'browserAction',
  'cookies',
  'extension',
  'pageAction',
  'storage',
  'tabs',
];

const BrowserApi: any = apis.reduce((obj, api) => ({
  ...obj,
  [api]: (window['browser'] && window['browser'][api]) || (window['chrome'] && window['chrome'][api]) || window[api],
}), {})

BrowserApi.openExtensionInNewTab = (relativeUrl: string) => {
  BrowserApi.tabs.create({ url: BrowserApi.extension.getURL(`index.html#/${relativeUrl}`) });
}

export { BrowserApi };


