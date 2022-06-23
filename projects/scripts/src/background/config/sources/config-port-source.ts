import { Observable } from 'rxjs';
import Browser from 'webextension-polyfill';

import { Config, ConfigSource } from '@shared/services/configuration/config.definitions';
import { CONFIG_PORT_NAME } from '../config-port-name';

export class ConfigPortSource extends ConfigSource {

  public override getConfig(): Observable<Config> {
    const port = Browser.runtime.connect({ name: CONFIG_PORT_NAME });

    return new Observable<Config>((subscriber) => {
      const configListener = (config) => subscriber.next(config);

      port.onMessage.addListener(configListener);

      return () => port.disconnect();
    });
  }
}
