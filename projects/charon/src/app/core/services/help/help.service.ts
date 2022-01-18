import { Injectable } from '@angular/core';

import { Environment } from '@environments/environment.definitions';
import { isOpenedInTab } from '@shared/utils/browser';

@Injectable()
export class HelpService {
  constructor(private environment: Environment) {
  }

  private get beacon(): (...args) => void {
    return window['Beacon'];
  }

  public initialize(): void {
    if (!isOpenedInTab()) {
      return;
    }

    const script = document.createElement('script');
    script.textContent = `!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});`;

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
