import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { pairwise } from 'rxjs/operators';

import { BrowserLocalStorage, BrowserStorage } from '@shared/services/browser-storage';

export enum ThemeMode {
  Dark = 'dark',
  Light = 'light',
}

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeStorage: BrowserStorage<{ theme: ThemeMode }> = BrowserLocalStorage.getInstance();

  constructor() {
    this.getThemeValue().pipe(
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
