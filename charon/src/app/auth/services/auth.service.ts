import { Injectable } from '@angular/core';
import { AuthStore } from '../store';

@Injectable()
export class AuthService {
  public isLoggedIn: boolean = true;

  constructor(private store: AuthStore) {
  }
}
