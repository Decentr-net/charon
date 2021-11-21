import { PDVUpdateNotifier } from '../../../shared/services/pdv';
import { initMessageListeners } from './background/listeners';
import { initAutoLock } from './background/lock';
import { initMigration } from './background/migration';
import { initNetwork } from './background/network';
import { initPDVCollection } from './background/pdv';
import { whileVersionSupported } from './background/technical';
import initContextMenu from './background/context-menu';
import { handleMultipleInstallations } from './background/installation';

(async () => {
  await handleMultipleInstallations();

  initMigration();

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
