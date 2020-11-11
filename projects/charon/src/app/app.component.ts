import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { AuthService } from '@core/auth';
import { LockService } from '@core/lock';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private lockService: LockService
  ) {
  }

  public async ngOnInit(): Promise<void> {
    if (this.authService.isLoggedIn) {
      await this.lockService.init();
    }
  }
}
