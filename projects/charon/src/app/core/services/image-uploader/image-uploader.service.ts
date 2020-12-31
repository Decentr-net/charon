import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ImageApiService } from '@core/services/api';

@Injectable()
export class ImageUploaderService {
  constructor(
    private imageApiService: ImageApiService,
  ) {
  }

  public upload(image: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', image);

    return this.imageApiService.upload(image).pipe(
      map((response) => response.data.link),
    );
  }
}
