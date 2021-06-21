import { PDVUpdateNotifier } from '../../../shared/services/pdv';
import { initMessageListeners } from './background/listeners';
import { initAutoLock } from './background/lock';
import { initMigration } from './background/migration';
import { setRandomNetwork } from './background/network-switch';
import { initCookiesCollection } from './background/cookies/collection';
import { initProxy } from './background/proxy';
import { whileApplicationAvailable } from './background/technical';

(async () => {
  initMigration();

  initProxy();

  await setRandomNetwork();

  initAutoLock();

  initMessageListeners();

  const pdvUpdateNotifier = new PDVUpdateNotifier();
  pdvUpdateNotifier.start();

  initCookiesCollection().pipe(
    whileApplicationAvailable(),
  ).subscribe(() => pdvUpdateNotifier.notify());
})();
