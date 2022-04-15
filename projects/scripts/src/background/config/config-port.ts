import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import * as Browser from 'webextension-polyfill';

import { ConfigService } from '../../../../../shared/services/configuration/config.service';
import CONFIG_SERVICE from './config';
import { CONFIG_PORT_NAME } from './config-port-name';

class ConfigPort {
  private readonly destroy$: Subject<void> = new Subject();

  private readonly ports: Browser.Runtime.Port[] = [];

  private anyPortHandler = (port: Browser.Runtime.Port) => {
    if (port.name !== CONFIG_PORT_NAME) {
      return;
    }

    this.handleConfigPort(port);
    this.configService.forceUpdate();
  };

  constructor(private configService: ConfigService) {
    Browser.runtime.onConnect.addListener(this.anyPortHandler);

    this.subscribeConfigChanges();
  }

  public destroy(): void {
    Browser.runtime.onConnect.removeListener(this.anyPortHandler);

    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleConfigPort(port: Browser.Runtime.Port): void {
    this.ports.push(port);

    port.onDisconnect.addListener(() => {
      const portIndex = this.ports.indexOf(port);
      if (portIndex > -1) {
        this.ports.splice(portIndex, 1);
      }
    });
  }

  private subscribeConfigChanges(): void {
    this.configService.getConfig().pipe(
      takeUntil(this.destroy$),
    ).subscribe((config) => {
      this.ports.forEach((port) => port.postMessage(config));
    });
  }
}

export const initializeConfigPort = () => {
  new ConfigPort(CONFIG_SERVICE);
};
