import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { BrowserLocalStorage, BrowserStorage } from '@shared/services/browser-storage';

export enum ThemeMode {
  Dark = 'dark',
  Light = 'light',
}

@UntilDestroy()
@Injectable()
export class ThemeService {
  private themeStorage: BrowserStorage<{ theme: ThemeMode }> = BrowserLocalStorage.getInstance();

  public initialize(): void {
    this.getThemeValue().pipe(
      startWith(undefined),
      pairwise(),
      untilDestroyed(this),
    ).subscribe(([previousTheme, currentTheme]) => {
      document.body.classList.remove(ThemeService.createThemeClass(previousTheme));
      document.body.classList.add(ThemeService.createThemeClass(currentTheme));
    });
  }

  public getThemeValue(): Observable<ThemeMode> {
    return this.themeStorage.observe('theme');
  }

  public setThemeValue(value: ThemeMode): Promise<void> {
    return this.themeStorage.set('theme', value);
  }

  private static createThemeClass(theme: ThemeMode): string {
    return `theme-${theme}`;
  }
}
