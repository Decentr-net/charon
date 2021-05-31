import { defer, Observable } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';
import { browser, Types } from 'webextension-polyfill-ts';
import { BrowserType, detectBrowser } from './browser';

declare const chrome;

const browserType: typeof BrowserType = BrowserType;

export interface ExtensionProxySettings {
  levelOfControl: Types.LevelOfControl;
  host?: string;
  port?: string;
}

const clearProxySettings = (): Promise<void> => {
  if (detectBrowser() === browserType.Chrome) {
    return new Promise((resolve) => {
      chrome.proxy.settings.clear({}, resolve);
    });
  }

  return browser.proxy.settings.clear({});
};

const getProxySettings = (details: Types.SettingGetDetailsType): Promise<Types.SettingGetCallbackDetailsType> => {
  if (detectBrowser() === browserType.Chrome) {
    return new Promise((resolve) => {
      chrome.proxy.settings.get(details, resolve);
    });
  }

  return browser.proxy.settings.get({});
};

const setProxySettings = (details: Types.SettingSetDetailsType): Promise<void> => {
  if (detectBrowser() === browserType.Chrome) {
    return new Promise((resolve) => {
      chrome.proxy.settings.set(details, resolve);
    });
  }

  return browser.proxy.settings.set(details);
};

const onProxySettingsChange = (): Observable<Types.SettingOnChangeDetailsType> => {
  return new Observable<Types.SettingOnChangeDetailsType>((subscriber) => {
    const listener = (changeDetails: Types.SettingOnChangeDetailsType) => subscriber.next(changeDetails);

    browser.proxy.settings.onChange.addListener(listener);

    return () => browser.proxy.settings.onChange.removeListener(listener);
  });
};

export const getActiveProxySettings = (): Observable<ExtensionProxySettings> => {
  return defer(() => getProxySettings({})).pipe(
    mergeMap((settings) => onProxySettingsChange().pipe(
      startWith(settings),
    )),
    map((settings) => ({
      levelOfControl: settings.levelOfControl,
      ...detectBrowser() === browserType.Chrome && settings.value?.rules?.singleProxy,
      // TODO: adjust for Firefox
      ...detectBrowser() === browserType.Firefox && settings.levelOfControl === 'controlled_by_this_extension' && {
        host: settings.value?.http.split(':')[0],
        port: settings.value?.http.split(':')[1],
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

    const errorNotifier = browser.proxy.onError || (browser.proxy as any).onProxyError;

    errorNotifier.addListener(listener);

    return () => errorNotifier.removeListener(listener);
  });
};

export const setProxy = (server: { host: string; port?: number } | undefined): Promise<void> => {
  if (!server) {
    return clearProxySettings();
  }

  let config;

  if (detectBrowser() === browserType.Chrome) {
    config = {
      mode: 'fixed_servers',
      rules: {
        singleProxy: {
          scheme: 'http',
          host: server.host,
          port: server.port,
        },
        bypassList: ['*localhost*', '*127.0.0.1*'],
      },
    };
  }

  if (detectBrowser() === browserType.Firefox) {
    config = {
      httpProxyAll: true,
      proxyType: "manual",
      http: `${server.host}:${server.port}`,
      socksVersion: 4,
    };
  }

  return setProxySettings({
    value: config,
    ...detectBrowser() === browserType.Chrome && { scope: 'regular' },
  });
};
