import { Wallet } from 'decentr-js';

export interface UserSettingsStorage {
  lock: unknown;
  pdv: unknown;
}

export type SettingsStorage = Record<Wallet['address'], UserSettingsStorage>;
