import * as Browser from 'webextension-polyfill';
import { WireguardService } from '@shared/services/wireguard';

const wireguardService = new WireguardService();

const disableWireguard = () => {
  wireguardService.disconnect().then();
};

const init = () => {
  Browser.contextMenus.create({
    title: 'Disable VPN',
    contexts: [
      'browser_action',
    ],
    onclick: disableWireguard,
  });
};

export default init;
