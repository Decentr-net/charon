import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { AuthService } from '../../auth';
import { DecentrService } from '../decentr';

@Injectable()
export class ImageUploaderService {
  constructor(
    private authService: AuthService,
    private decentrService: DecentrService,
  ) {
  }

  public upload(image: File): Observable<string> {
    const wallet = this.authService.getActiveUserInstant().wallet;

    return this.decentrService.cerberusClient.pipe(
      mergeMap((cerberusClient) => cerberusClient.image.save(image, wallet)),
      map((response) => response.hd),
    );
  }
}
