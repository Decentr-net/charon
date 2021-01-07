import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { ImageApiService } from '@core/services/api';

@Injectable()
export class ImageUploaderService {
  constructor(
    private imageApiService: ImageApiService,
  ) {
  }

  public upload(image: File): Observable<string> {
    return this.imageApiService.upload(image).pipe(
      pluck('data', 'url'),
    );
  }
}
