import { ActivityPageComponent } from './activity-page';
import { AssetsPageComponent } from './assets-page';
import { PdvRatePageComponent } from './pdv-rate-page';
import { PortalPageComponent } from './portal-page';

export * from './activity-page';
export * from './assets-page';
export * from './pdv-rate-page';
export * from './portal-page';

export const PORTAL_PAGES = [
  ActivityPageComponent,
  AssetsPageComponent,
  PdvRatePageComponent,
  PortalPageComponent,
];
