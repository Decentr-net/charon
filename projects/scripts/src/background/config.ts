import { ConfigService } from '../../../../shared/services/configuration';
import { NetworkBrowserStorageService } from '../../../../shared/services/network-storage';
import { environment } from '../../../../environments/environment';

const CONFIG_SERVICE = new ConfigService(environment, new NetworkBrowserStorageService());

export default CONFIG_SERVICE;
