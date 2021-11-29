import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { SettingsService } from '@shared/services/settings';
import { ONE_HOUR, ONE_MINUTE } from '@shared/utils/date';
import { AuthService } from '@core/auth';

interface DelayOption {
  i18nKey: string;
  value: number;
}

@Component({
  selector: 'app-lock-delay-settings',
  templateUrl: './lock-delay-settings.component.html',
  styleUrls: ['./lock-delay-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LockDelaySettingsComponent implements OnInit {
  public lockDelay$: Observable<number>;

  public options: DelayOption[] = [
    {
      value: ONE_MINUTE * 10,
      i18nKey: '10m',
    },
    {
      value: ONE_HOUR,
      i18nKey: '1h',
    },
    {
      value: ONE_HOUR * 24,
      i18nKey: '24h',
    },
    {
      value: ONE_HOUR * 48,
      i18nKey: '48h',
    },
    {
      value: 0,
      i18nKey: 'never',
    },
  ];

  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
  ) {
  }

  public ngOnInit(): void {
    this.lockDelay$ = this.authService.getActiveUser().pipe(
      filter((user) => !!user),
      switchMap((user) => this.settingsService.getUserSettingsService(user.wallet.address).lock.getLockDelay()),
      map((delay) => delay),
    );
  }

  public onLockDelayChange(delay: number): void {
    const walletAddress = this.authService.getActiveUserInstant().wallet.address;

    this.settingsService.getUserSettingsService(walletAddress).lock.setLockDelay(delay);
  }
}
