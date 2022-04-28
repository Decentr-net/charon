import { InjectionToken } from '@angular/core';

export enum AnalyticsEvent {
  ConfirmRegistration,
  CopyPostLink,
  CopyReferralCode,
  CopySeed,
  CreateAccount,
  DownloadSeedPDF,
  RegisterNewAccount,
  SendEmailCode,
}

export interface AnalyticsEventOptions {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export const ANALYTICS_EVENT_MAP: Record<AnalyticsEvent, AnalyticsEventOptions> = {
  [AnalyticsEvent.ConfirmRegistration]: {
    category: 'registration',
    action: 'confirm',
    label: 'Confirm Registration',
  },
  [AnalyticsEvent.CopyPostLink]: {
    category: 'dhub',
    action: 'copy',
    label: 'Copy dHub post link',
  },
  [AnalyticsEvent.CopyReferralCode]: {
    category: 'profile',
    action: 'copy',
    label: 'Copy Referral Code',
  },
  [AnalyticsEvent.CopySeed]: {
    category: 'registration',
    action: 'copy',
    label: 'Copy Seed Phrase',
  },
  [AnalyticsEvent.CreateAccount]: {
    category: 'registration',
    action: 'create_account',
    label: 'Create account',
  },
  [AnalyticsEvent.DownloadSeedPDF]: {
    category: 'registration',
    action: 'download',
    label: 'Download Seed Phrase',
  },
  [AnalyticsEvent.RegisterNewAccount]: {
    category: 'registration',
    action: 'register',
    label: 'Register New Account',
  },
  [AnalyticsEvent.SendEmailCode]: {
    category: 'registration',
    action: 'send',
    label: 'Resend Email Code',
  },
};

export const ANALYTICS_TRACKER_ID: InjectionToken<string> = new InjectionToken('ANALYTICS_TRACKER_ID');
