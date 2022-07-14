import { AUTH_GUARDS } from './auth';
import { BrowserTabGuard } from './browser-tab.guard';
import { MainnetGuard } from './mainnet.guard';
import { MaintenanceGuard } from './maintenance.guard';
import { OfflineGuard } from './offline.guard';
import { SupportedVersionGuard } from './supported-version.guard';
import { UpdateGuard } from './update.guard';

export { AuthCompletedRegistrationGuard, UnauthGuard } from './auth';
export * from './browser-tab.guard';
export * from './mainnet.guard';
export * from './maintenance.guard';
export * from './offline.guard';
export * from './supported-version.guard';
export * from './update.guard';

export const CORE_GUARDS = [
  ...AUTH_GUARDS,
  BrowserTabGuard,
  MaintenanceGuard,
  MainnetGuard,
  OfflineGuard,
  SupportedVersionGuard,
  UpdateGuard,
];
