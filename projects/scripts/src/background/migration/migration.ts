import * as Browser from 'webextension-polyfill';

import { compareSemver } from '@shared/utils/number';
import { APP_VERSION } from '@shared/utils/version';
import QUEUE from '../queue';
import { migrate as migrateTo133 } from './1.3.3';
import { migrate as migrateTo200 } from './2.0.0';
import { migrate as migrateTo220 } from './2.2.0';
import { migrate as migrateTo350 } from './3.5.0';

interface MigrationScriptConfig {
  version: string;
  script: () => Promise<void>;
}

const SCRIPTS_CONFIGURATION: MigrationScriptConfig[] = [
  {
    version: '1.3.3',
    script: migrateTo133,
  },
  {
    version: '2.0.0',
    script: migrateTo200,
  },
  {
    version: '2.2.0',
    script: migrateTo220,
  },
  {
    version: '3.5.0',
    script: migrateTo350,
  },
];

export const initMigration = (): void => {
  Browser.runtime.onInstalled.addListener(({ previousVersion }) => {
    if (!previousVersion) {
      return;
    }

    const migrationScripts = SCRIPTS_CONFIGURATION
      .filter((config) => {
        return compareSemver(config.version, previousVersion) > 0 && APP_VERSION >= config.version;
      })
      .map(({ script }) => script);

    QUEUE.addAll(migrationScripts).then();
  });
};
