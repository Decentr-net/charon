import { defer, Observable } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';
import { browser, Types } from 'webextension-polyfill-ts';

declare const chrome;

export interface ExtensionProxySettings {
  levelOfControl: Types.LevelOfControl;
  host?: string;
  port?: string;
}

const clearProxySettings = (): Promise<void> => {
  if (chrome) {
    return new Promise((resolve) => {
      chrome.proxy.settings.clear({}, resolve);
    });
  }

  return browser.proxy.settings.clear({});
};

const getProxySettings = (details: Types.SettingGetDetailsType): Promise<Types.SettingGetCallbackDetailsType> => {
  if (chrome) {
    return new Promise((resolve) => {
      chrome.proxy.settings.get(details, resolve);
    });
  }

  return browser.proxy.settings.get({});
};

const setProxySettings = (details: Types.SettingSetDetailsType): Promise<void> => {
  if (chrome) {
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
      ...settings.value?.rules?.singleProxy,
    })),
  );
};

export const listenProxyErrors = (): Observable<void> => {
  return new Observable<void>((subscriber) => {
    const listener = () => subscriber.next();

    let errorNotifier = chrome ? chrome.proxy.onProxyError : browser.proxy.onError;

    errorNotifier.addListener(listener);

    return () => errorNotifier.removeListener(listener);
  });
};

export const setProxy = (host: string | undefined): Promise<void> => {
  if (!host) {
    return clearProxySettings();
  }

  const [ip, port] = host.split(':');

  const config = {
    mode: 'fixed_servers',
    rules: {
      singleProxy: {
        scheme: 'http',
        host: ip,
        port: port && +port,
      },
    },
  };

  return setProxySettings({ value: config, scope: 'regular' });
};
