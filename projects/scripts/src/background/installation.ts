import * as Browser from 'webextension-polyfill';

import { isInstalledAsExtension } from '@shared/utils/browser';

declare const IS_QA_MODE: boolean;

export const handleMultipleInstallations = async (): Promise<void> => {
  const isNotDecentrComponent = await isInstalledAsExtension();

  if (isNotDecentrComponent && !IS_QA_MODE) {
    await Browser.management.uninstallSelf();
  }
};
