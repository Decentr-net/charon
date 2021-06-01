import { browser } from 'webextension-polyfill-ts';

import { compareSemver } from '../../../../../shared/utils/number';
import QUEUE from '../queue';
import { migrate as migrateTo150 } from './1.5.0';

interface MigrationScriptConfig {
  version: string;
  script: () => Promise<void>;
}

const SCRIPTS_CONFIGURATION: MigrationScriptConfig[] = [
  {
    version: '1.5.0',
    script: migrateTo150,
  },
];

export const initMigration = (): void => {
  browser.runtime.onInstalled.addListener(({ previousVersion }) => {
    if (!previousVersion) {
      return;
    }

    const migrationScripts = SCRIPTS_CONFIGURATION
      .filter((config) => compareSemver(config.version, previousVersion) > 0)
      .map(({ script }) => script);

    QUEUE.addAll(migrationScripts).then();
  });
};
