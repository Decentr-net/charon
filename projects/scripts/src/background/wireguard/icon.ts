import { merge } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import Browser from 'webextension-polyfill';

import { WireguardService } from '@shared/services/wireguard';

type IconsConfig = { [size: string]: string };

const wireguardService = new WireguardService();

const WIREGUARD_ENABLED_ICONS_CONFIG: IconsConfig = {
  16: 'assets/icons/16_active.png',
  32: 'assets/icons/32_active.png',
};

const WIREGUARD_DISABLED_ICONS_CONFIG: IconsConfig = {
  16: 'assets/icons/16.png',
  32: 'assets/icons/32.png',
};

const setExtensionIcon = (icons: IconsConfig): Promise<void> => {
  return Browser.browserAction.setIcon({
    path: icons,
  });
};

export const initApplicationIconChanger = (): void => {
  merge(
    wireguardService.onStatusChanges().pipe(tap((r) => console.log('init: on status changes', r))),
    wireguardService.status().then((response) => {
      console.log('init: status', response.result);
      return response.result;
    }),
  ).pipe(
    mergeMap((isEnabled) => {
      console.log('init: isEnabled', isEnabled);
      return setExtensionIcon(isEnabled ? WIREGUARD_ENABLED_ICONS_CONFIG : WIREGUARD_DISABLED_ICONS_CONFIG);
    }),
  ).subscribe();
};
