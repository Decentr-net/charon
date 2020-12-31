import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Environment } from '@environments/environment.definitions';
import { UploadImageResponse } from './image-api.definitions';

@Injectable()
export class ImageApiService {
  constructor(
    private environment: Environment,
    private httpClient: HttpClient,
  ) {
  }

  public upload(image: File): Observable<UploadImageResponse> {
    const formData = new FormData();
    formData.append('image', image);

    return this.httpClient.post<UploadImageResponse>(this.environment.imageApi, formData);
  }
}
