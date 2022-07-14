import { ConfigService } from '@shared/services/configuration/config.service';
import { NetworkBrowserStorageService } from '@shared/services/network-storage';
import { ConfigApiSource } from './sources/config-api-source';

const CONFIG_SERVICE = new ConfigService(new ConfigApiSource(), new NetworkBrowserStorageService());

export default CONFIG_SERVICE;
