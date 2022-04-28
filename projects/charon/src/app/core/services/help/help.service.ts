import { Injectable } from '@angular/core';

import { Environment } from '@environments/environment.definitions';
import { isOpenedInTab } from '@shared/utils/browser';

@Injectable()
export class HelpService {
  constructor(private environment: Environment) {
  }

  private get beacon(): (...args) => void {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    return window['Beacon'];
  }

  public initialize(): void {
    if (!isOpenedInTab()) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'scripts/help-beacon.js';

    const container = document.head || document.documentElement;
    container.insertBefore(script, container.children[0]);

    if (this.beacon) {
      this.initBeacon();
    } else {
      script.addEventListener('load', () => this.initBeacon());
    }
  }

  private initBeacon(): void {
    this.beacon('init', this.environment.help);
  }
}
