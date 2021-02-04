import { Injectable } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

import { Config, ConfigApiService } from './config-api.service';
import { Environment } from '../../../environments/environment.definitions';

@Injectable()
export class ConfigService {
  private config$: BehaviorSubject<Config> = new BehaviorSubject(void 0);
  private pendingConfig: boolean;

  private readonly configApiService: ConfigApiService = new ConfigApiService(this.environment);

  constructor(
    private environment: Environment,
  ) {
  }

  private getConfig(): Observable<Config> {
    if (!this.pendingConfig) {
      this.pendingConfig = true;

      this.configApiService.getConfig().subscribe(this.config$);
    }

    return this.config$.pipe(
      filter((config) => !!config),
    );
  }

  public forceUpdate(): void {
    this.config$.next(void 0);
    this.pendingConfig = false;
  }

  public getAppMinVersionRequired(): Observable<string> {
    return this.getConfig().pipe(
      map(({ minVersion }) => minVersion),
    );
  }

  public getRestNodes(): Observable<string[]> {
    return this.getConfig().pipe(
      map(({ network }) => network.rest),
    );
  }

  public getPDVCountToSend(): Observable<Pick<Config['cerberus'], 'minPDVCount' | 'maxPDVCount'>> {
    return this.getConfig().pipe(
      map((config) => config.cerberus),
    );
  }
}
