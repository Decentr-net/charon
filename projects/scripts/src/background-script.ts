import { initMessageListeners } from './background/listeners';
import { initAutoLock } from './background/lock';
import { initMigration } from './background/migration';
import { initNetwork } from './background/network';
import { initPDVCollection } from './background/pdv';
import { whileVersionSupported } from './background/technical';
import initContextMenu from './background/context-menu';
import { handleMultipleInstallations } from './background/installation';
import { initializeConfigPort } from './background/config';

(async () => {
  await handleMultipleInstallations();

  initMigration();

  await initNetwork();

  initAutoLock();

  initMessageListeners();

  initPDVCollection().pipe(
    whileVersionSupported,
  ).subscribe();

  initContextMenu();

  initializeConfigPort();
})();
