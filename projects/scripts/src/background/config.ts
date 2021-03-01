import { ConfigService } from '../../../../shared/services/configuration';
import { environment } from '../../../../environments/environment';

const CONFIG_SERVICE = new ConfigService(environment);

export default CONFIG_SERVICE;
