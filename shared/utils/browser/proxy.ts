import { defer, Observable } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';
import * as Browser from 'webextension-polyfill';

import { BrowserType, detectBrowser } from './browser';
import { environment } from '../../../environments/environment';

declare const chrome;

const CURRENT_BROWSER_TYPE: BrowserType = detectBrowser();

export enum ProxyErrorMessage {
  UnknownBrowser = 'Unknown browser',
}

export interface ExtensionProxySettings {
  levelOfControl: Browser.Types.LevelOfControl;
  host?: string;
  port?: string;
}

const clearProxySettings = (): Promise<void> => {
  switch (CURRENT_BROWSER_TYPE) {
    case BrowserType.Chrome:
      return new Promise((resolve) => {
        chrome.proxy.settings.clear({}, resolve);
      });

    default:
      return Browser.proxy.settings.clear({});
  }
};

const getProxySettings = (
  details: Browser.Types.SettingGetDetailsType,
): Promise<Browser.Types.SettingGetCallbackDetailsType> => {
  switch (CURRENT_BROWSER_TYPE) {
    case BrowserType.Chrome:
      return new Promise((resolve) => {
        chrome.proxy.settings.get(details, resolve);
      });

    case BrowserType.Firefox:
      return Browser.proxy.settings.get({});

    default:
      throw new Error(ProxyErrorMessage.UnknownBrowser);
  }
};

const setProxySettings = (details: Browser.Types.SettingSetDetailsType): Promise<void> => {
  switch (CURRENT_BROWSER_TYPE) {
    case BrowserType.Chrome:
      return new Promise((resolve) => {
        chrome.proxy.settings.set(details, resolve);
      });

    case BrowserType.Firefox:
      return Browser.proxy.settings.set(details);

    default:
      throw new Error(ProxyErrorMessage.UnknownBrowser);
  }
};

const onProxySettingsChange = (): Observable<Browser.Types.SettingOnChangeDetailsType> => {
  return new Observable<Browser.Types.SettingOnChangeDetailsType>((subscriber) => {
    const listener = (changeDetails: Browser.Types.SettingOnChangeDetailsType) => subscriber.next(changeDetails);

    Browser.proxy.settings.onChange.addListener(listener);

    return () => Browser.proxy.settings.onChange.removeListener(listener);
  });
};

export const getActiveProxySettings = (): Observable<ExtensionProxySettings> => {
  return defer(() => getProxySettings({})).pipe(
    mergeMap((settings) => onProxySettingsChange().pipe(
      startWith(settings),
    )),
    map((settings) => ({
      levelOfControl: settings.levelOfControl,
      ...CURRENT_BROWSER_TYPE === BrowserType.Chrome && settings.value?.rules?.singleProxy,
      ...CURRENT_BROWSER_TYPE === BrowserType.Firefox && settings.levelOfControl === 'controlled_by_this_extension' && {
        host: settings.value?.http?.split(':')[0],
        port: settings.value?.http?.split(':')[1],
      },
    })),
  );
};

export const isSelfProxyEnabled = (): Observable<boolean> => {
  return getActiveProxySettings().pipe(
    map((settings) => settings.levelOfControl === 'controlled_by_this_extension'),
  );
};

export const listenProxyErrors = (): Observable<void> => {
  return new Observable<void>((subscriber) => {
    const listener = () => subscriber.next();

    const errorNotifier = Browser.proxy.onError || (Browser.proxy as any).onProxyError;

    errorNotifier.addListener(listener);

    return () => errorNotifier.removeListener(listener);
  });
};

const getProxyConfig = (host: string, port: number): unknown => {
  switch (CURRENT_BROWSER_TYPE) {
    case BrowserType.Chrome:
      return {
        mode: 'fixed_servers',
        rules: {
          singleProxy: {
            scheme: 'http',
            host,
            port,
          },
          bypassList: ['*localhost*', '*127.0.0.1*', `${environment.config}*`],
        },
      };
    case BrowserType.Firefox:
      return {
        httpProxyAll: true,
        proxyType: 'manual',
        http: `${host}:${port}`,
        socksVersion: 4,
        passthrough: `localhost, 127.0.0.1, ${new URL(environment.config).hostname}`,
      };
    default:
      return void 0;
  }
};

export const clearProxy = (): Promise<void> => {
  return clearProxySettings();
};

export const setProxy = (host: string, port: number): Promise<void> => {
  return setProxySettings({
    value: getProxyConfig(host, port),
    scope: 'regular',
    // ...detectBrowser() === BrowserType.Chrome && { scope: 'regular' },
  });
};
