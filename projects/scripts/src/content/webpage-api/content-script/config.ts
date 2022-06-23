import { ConfigService } from '@shared/services/configuration/config.service';
import { NetworkBrowserStorageService } from '@shared/services/network-storage';
import { ConfigPortSource } from '../../../background/config/sources/config-port-source';

const networkBrowserStorageService = new NetworkBrowserStorageService();

const CONFIG_SERVICE = new ConfigService(new ConfigPortSource(), networkBrowserStorageService);

export { CONFIG_SERVICE };
