import { NetworkId } from '@shared/services/configuration';

export interface Network {
  id: NetworkId;
  name: string;
}

export interface NetworkSelectorTranslations {
  title: string;
  defaultNetwork: string;
}
