import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { KeyPair, saveImage, SaveImageResponse } from 'decentr-js';

import { ConfigService } from '@shared/services/configuration';

@Injectable()
export class ImageApiService {
  constructor(
    private configService: ConfigService,
  ) {
  }

  public upload(image: File, keyPair: KeyPair): Observable<SaveImageResponse> {
    return this.configService.getCerberusUrl().pipe(
      mergeMap((cerberusUrl) => saveImage(cerberusUrl, image, keyPair)),
    );
  }
}
