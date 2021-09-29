import { PDVUpdateNotifier } from '../../../shared/services/pdv/pdv-update-notifier';
import { BrowserType, detectBrowser } from '../../../shared/utils/browser';
import { initMessageListeners } from './background/listeners';
import { initAutoLock } from './background/lock';
import { initMigration } from './background/migration';
import { initNetwork } from './background/network';
import { initPDVCollection } from './background/pdv';
import { initProxy } from './background/proxy';
import { whileVersionSupported } from './background/technical';
import initContextMenu from './background/context-menu';

const CURRENT_BROWSER_TYPE: BrowserType = detectBrowser();

(async () => {
  initMigration();

  if (CURRENT_BROWSER_TYPE !== BrowserType.Decentr) {
    initProxy();
  }

  await initNetwork();

  initAutoLock();

  initMessageListeners();

  const pdvUpdateNotifier = new PDVUpdateNotifier();
  pdvUpdateNotifier.start();

  initPDVCollection().pipe(
    whileVersionSupported(),
  ).subscribe(() => pdvUpdateNotifier.notify());

  initContextMenu();
})();
