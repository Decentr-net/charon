import { PDVUpdateNotifier } from '../../../shared/services/pdv';
import { initMessageListeners } from './background/listeners';
import { initAutoLock } from './background/lock';
import { initMigration } from './background/migration';
import { setRandomNetwork } from './background/network-switch';
import { initCookiesCollection } from './background/cookies/collection';

(async () => {
  initMigration();

  await setRandomNetwork();

  initAutoLock();

  initMessageListeners();

  const pdvUpdateNotifier = new PDVUpdateNotifier();
  pdvUpdateNotifier.start();

  initCookiesCollection()
    .subscribe(() => pdvUpdateNotifier.notify());
})();
