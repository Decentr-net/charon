import { PDVUpdateNotifier } from '../../../shared/services/pdv';
import { initMessageListeners } from './background/listeners';
import { initAutoLock } from './background/lock';
import { initMigration } from './background/migration';
import { setRandomNetwork } from './background/network-switch';
import { initPDVCollection } from './background/pdv';
import { whileApplicationAvailable } from './background/technical';

(async () => {
  initMigration();

  await setRandomNetwork();

  initAutoLock();

  initMessageListeners();

  const pdvUpdateNotifier = new PDVUpdateNotifier();
  pdvUpdateNotifier.start();

  initPDVCollection().pipe(
    whileApplicationAvailable(),
  ).subscribe(() => pdvUpdateNotifier.notify());
})();
