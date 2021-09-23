import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

import { AuthService } from '@core/auth';
import { ImageApiService } from '@core/services/api';

@Injectable()
export class ImageUploaderService {
  constructor(
    private authService: AuthService,
    private imageApiService: ImageApiService,
  ) {
  }

  public upload(image: File): Observable<string> {
    return this.imageApiService.upload(image, this.authService.getActiveUserInstant().wallet).pipe(
      pluck('hd'),
    );
  }
}
