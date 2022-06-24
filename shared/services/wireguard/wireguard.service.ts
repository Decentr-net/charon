import Browser from 'webextension-polyfill';

import { HostConnectRequest } from './wireguard.definitions';

const HOST_APP_WIREGUARD = 'com.decentr.wireguard';

export class WireguardService {
  private sendMessage(appId, message): Promise<unknown> {
    return Browser.runtime.sendNativeMessage(appId, message);
  }

  public connect(params: HostConnectRequest): Promise<void> {
    return Promise.resolve(void 0);
  }

  public disconnect(): Promise<unknown> {
    return Promise.resolve(true);

    // const request = {};
    //
    // return this.sendMessage(HOST_APP_WIREGUARD, request)
    //   .then((response) => console.log('Response: ' + JSON.stringify(response)))
    //   .catch((error) => console.log('Error: ' + error.message));
  }

  public status(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
