import { Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { mergeMap, pluck, tap } from 'rxjs/operators';

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
    // return new Observable<string>((subscriber) => {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     subscriber.next(reader.result as string);
    //   };
    //   reader.readAsDataURL(image);
    // }).pipe(
    //   mergeMap((buf) => this.imageApiService.upload(buf as any, this.authService.getActiveUserInstant().wallet)),
    //   pluck('hd')
    // );

    console.log(image);
    //
    // const buf = new Observable((sub) => {
    //   const fileReader = new FileReader();
    //   fileReader.onloadend = () => sub.next(fileReader.result as string);
    //   fileReader.readAsBinaryString(image.slice());
    // });
    //
    // return buf.pipe(
    //   tap(console.log),
    //   mergeMap((buf1: any) => this.imageApiService.upload(buf1, this.authService.getActiveUserInstant().wallet)),
    //   pluck('hd'),
    // );

    return this.imageApiService.upload(image, this.authService.getActiveUserInstant().wallet).pipe(
      pluck('hd'),
    );
  }
}
