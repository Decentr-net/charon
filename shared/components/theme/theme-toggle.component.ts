import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ThemeMode, ThemeService } from './theme.service';

@UntilDestroy()
@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent implements OnInit {
  public value: boolean;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private themeService: ThemeService,
  ) {
  }

  public ngOnInit(): void {
    this.themeService.getThemeValue().pipe(
      untilDestroyed(this),
    ).subscribe((themeMode) => {
      this.value = themeMode === ThemeMode.Dark;
      this.changeDetectorRef.detectChanges();
    });
  }

  public onToggleTheme(value: boolean): void {
    const themeMode = value ? ThemeMode.Dark : ThemeMode.Light;

    this.themeService.setThemeValue(themeMode);
  }
}
