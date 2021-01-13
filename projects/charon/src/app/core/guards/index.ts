import { BrowserTabGuard } from './browser-tab.guard';
import { SupportedVersionGuard } from './supported-version.guard';

export * from './browser-tab.guard';
export * from './supported-version.guard';

export const CORE_GUARDS = [
  BrowserTabGuard,
  SupportedVersionGuard,
];
