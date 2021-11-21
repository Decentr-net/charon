export enum AnalyticsEvent {

}

export interface AnalyticsEventOptions {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export const ANALYTICS_EVENT_MAP: Record<AnalyticsEvent, AnalyticsEventOptions> = {

}
