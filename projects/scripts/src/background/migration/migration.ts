import { browser } from 'webextension-polyfill-ts';

import * as packageSettings from '../../../../../package.json';
import { compareSemver } from '../../../../../shared/utils/number';
import QUEUE from '../queue';
import { migrate as migrateTo133 } from './1.3.3';
import { migrate as migrateTo200 } from './2.0.0';
import { migrate as migrateTo220 } from './2.2.0';

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
];

export const initMigration = (): void => {
  browser.runtime.onInstalled.addListener(({ previousVersion }) => {
    if (!previousVersion) {
      return;
    }

    const migrationScripts = SCRIPTS_CONFIGURATION
      .filter((config) => {
        return compareSemver(config.version, previousVersion) > 0 && packageSettings.version >= config.version;
      })
      .map(({ script }) => script);

    QUEUE.addAll(migrationScripts).then();
  });
};
