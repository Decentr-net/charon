import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import { DecentrImageClient } from 'decentr-js';

import { ConfigService } from '@shared/services/configuration';
import { AuthService } from '@core/auth';

@Injectable()
export class ImageUploaderService {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
  }

  public upload(image: File): Observable<string> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return defer(() => this.createClient()).pipe(
      mergeMap((client) => client.saveImage(image, wallet)),
      pluck('hd'),
    )
  }

  private createClient(): Promise<DecentrImageClient> {
    return this.configService.getCerberusUrl().pipe(
      map((cerberusUrl) => new DecentrImageClient(cerberusUrl)),
    ).toPromise();
  }
}
