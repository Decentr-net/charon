import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { browser } from 'webextension-polyfill-ts';

import { isSelfProxyEnabled } from '../../../../../shared/utils/browser';

type IconsConfig = { [size: string]: string };

const PROXY_ENABLED_ICONS_CONFIG: IconsConfig = {
  '16': 'assets/icons/16_active.png',
  '32': 'assets/icons/32_active.png',
};

const PROXY_DISABLED_ICONS_CONFIG: IconsConfig = {
  '16': 'assets/icons/16.png',
  '32': 'assets/icons/32.png',
};

const setExtensionIcon = (icons: IconsConfig): Promise<void> => {
  return browser.browserAction.setIcon({
    path: icons,
  });
};

export const initApplicationIconChanger = (): Observable<void> => {
  return isSelfProxyEnabled().pipe(
    mergeMap((isEnabled) => {
      return setExtensionIcon(isEnabled ? PROXY_ENABLED_ICONS_CONFIG : PROXY_DISABLED_ICONS_CONFIG);
    }),
  );
};
