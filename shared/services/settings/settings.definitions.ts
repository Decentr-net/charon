import { Wallet } from 'decentr-js';

export interface UserSettingsStorage {
  pdv: unknown;
}

export type SettingsStorage = Record<Wallet['address'], UserSettingsStorage>;
