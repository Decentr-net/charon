import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  public createUser(): Observable<boolean> {
    return of(true);
  }
}
