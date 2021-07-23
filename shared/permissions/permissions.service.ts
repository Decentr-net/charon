import { Injectable } from '@angular/core';
import { coerceArray } from '@angular/cdk/coercion';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { arrayIntersection, excludeArrayValues } from '../utils/array';

@Injectable()
export class PermissionsService<T = string | number> {
  private permissions$: BehaviorSubject<T[]> = new BehaviorSubject([]);

  public getPermissions(): Observable<T[]> {
    return this.permissions$.asObservable();
  }

  public getPermissionsInstant(): T[] {
    return this.permissions$.value;
  }

  public setPermissions(permissions: T | T[]): void {
    this.permissions$.next(coerceArray(permissions));
  }

  public addPermissions(permissions: T | T[]): void {
    const currentPermissions = this.getPermissionsInstant();

    this.permissions$.next([
      ...currentPermissions,
      ...excludeArrayValues(coerceArray(permissions), currentPermissions),
    ]);
  }

  public removePermissions(permissions: T | T[]): void {
    this.permissions$.next(
      excludeArrayValues(this.getPermissionsInstant(), coerceArray(permissions))
    );
  }

  public clearPermissions(): void {
    this.permissions$.next([]);
  }

  public hasPermissions(permissions: T | T[]): Observable<boolean> {
    return this.getPermissions().pipe(
      map(() => this.hasPermissionsInstant(permissions)),
    );
  }

  public hasPermissionsInstant(permissions: T | T[]): boolean {
    return arrayIntersection(this.getPermissionsInstant(), coerceArray(permissions)).length > 0;
  }
}
