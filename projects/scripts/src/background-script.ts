import { PDVUpdateNotifier } from '../../../shared/services/pdv';
import { initMessageListeners } from './background/listeners';
import { initAutoLock } from './background/lock';
import { initMigration } from './background/migration';
import { setRandomNetwork } from './background/network-switch';
import { initPDVCollection } from './background/pdv';
import { initProxyHandlers } from './background/proxy';

(async () => {
  initMigration();

  initProxyHandlers();

  await setRandomNetwork();

  initAutoLock();

  initMessageListeners();

  const pdvUpdateNotifier = new PDVUpdateNotifier();
  pdvUpdateNotifier.start();

  initPDVCollection().subscribe(() => pdvUpdateNotifier.notify());
})();
