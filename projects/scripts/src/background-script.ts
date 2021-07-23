import { PDVUpdateNotifier } from '../../../shared/services/pdv';
import { BrowserType, detectBrowser } from '../../../shared/utils/browser';
import { initMessageListeners } from './background/listeners';
import { initAutoLock } from './background/lock';
import { initMigration } from './background/migration';
import { setRandomNetwork } from './background/network-switch';
import { initPDVCollection } from './background/pdv';
import { initProxy } from './background/proxy';
import { whileVersionSupported } from './background/technical';

const CURRENT_BROWSER_TYPE: BrowserType = detectBrowser();

(async () => {
  initMigration();

  if (CURRENT_BROWSER_TYPE !== BrowserType.Decentr) {
    initProxy();
  }

  await setRandomNetwork();

  initAutoLock();

  initMessageListeners();

  const pdvUpdateNotifier = new PDVUpdateNotifier();
  pdvUpdateNotifier.start();

  initPDVCollection().pipe(
    whileVersionSupported(),
  ).subscribe(() => pdvUpdateNotifier.notify());
})();
