import { Observable, switchMap, timer } from 'rxjs';
import { retry } from 'rxjs/operators';

import { environment } from '../../../../../../environments/environment';
import { Config, ConfigSource } from '../../../../../../shared/services/configuration/config.definitions';
import { ConfigApiService } from '../../../../../../shared/services/configuration/config-api.service';
import { ONE_SECOND } from '../../../../../../shared/utils/date';
import { whileOnline } from '../../../../../../shared/utils/online';

export class ConfigApiSource extends ConfigSource {
  private configApiService = new ConfigApiService(environment);

  private autoUpdateInterval = ONE_SECOND * 30;

  public override getConfig(): Observable<Config> {
    return timer(0, this.autoUpdateInterval).pipe(
      switchMap(() => this.configApiService.getConfig().pipe(
        retry({
          delay: ONE_SECOND,
        }),
      )),
      whileOnline,
    );
  }
}
