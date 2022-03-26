import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { merge, Observable, Subject } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';

import { BrowserLocalStorage, BrowserStorage } from '@shared/services/browser-storage';

export enum ThemeMode {
  Dark = 'dark',
  Light = 'light',
}

@UntilDestroy()
@Injectable()
export class ThemeService {
  public themeChanged$: Subject<void> = new Subject();

  private themeStorage: BrowserStorage<{ theme: ThemeMode }> = BrowserLocalStorage.getInstance();

  constructor() {
    this.getThemeValue().pipe(
      startWith(undefined),
      pairwise(),
      untilDestroyed(this),
    ).subscribe(([previousTheme, currentTheme]) => {
      document.body.classList.remove(`theme-${previousTheme}`);
      document.body.classList.add(`theme-${currentTheme}`);
    });
  }

  public getThemeValue(): Observable<ThemeMode> {
    return merge(
      this.themeStorage.get('theme'),
      this.themeStorage.onChange('theme'),
    );
  }

  public setThemeValue(value: ThemeMode): Promise<void> {
    return this.themeStorage.set('theme', value);
  }
}
