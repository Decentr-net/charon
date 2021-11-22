import { InjectionToken } from '@angular/core';

export enum AnalyticsEvent {
  DownloadSeedPDF,
}

export interface AnalyticsEventOptions {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export const ANALYTICS_EVENT_MAP: Record<AnalyticsEvent, AnalyticsEventOptions> = {
  [AnalyticsEvent.DownloadSeedPDF]: {
    category: 'Registration',
    action: 'download',
    label: 'Seed phrase',
  },
}

export const ANALYTICS_TRACKER_ID: InjectionToken<string> = new InjectionToken('ANALYTICS_TRACKER_ID');
