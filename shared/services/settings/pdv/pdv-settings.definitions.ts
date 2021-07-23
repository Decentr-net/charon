import { PDVType } from 'decentr-js';

export type CollectedPDVTypesSettings = Record<Exclude<PDVType, PDVType.Profile>, boolean>;

export interface PDVSettings {
  collectedTypes: CollectedPDVTypesSettings;
}
