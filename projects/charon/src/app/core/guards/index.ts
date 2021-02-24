import { BrowserTabGuard } from './browser-tab.guard';
import { MaintenanceGuard } from './maintenance.guard';
import { SupportedVersionGuard } from './supported-version.guard';
import { UpdateGuard } from './update.guard';

export * from './browser-tab.guard';
export * from './maintenance.guard';
export * from './supported-version.guard';
export * from './update.guard';

export const CORE_GUARDS = [
  BrowserTabGuard,
  MaintenanceGuard,
  SupportedVersionGuard,
  UpdateGuard,
];
