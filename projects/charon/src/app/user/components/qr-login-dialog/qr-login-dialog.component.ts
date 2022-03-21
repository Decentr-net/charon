import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { AuthService } from '@core/auth';

const helpLink: string = 'https://support.decentr.net/article/62-how-to-login-using-qr-code';

@Component({
  selector: 'app-qr-login-dialog',
  templateUrl: './qr-login-dialog.component.html',
  styleUrls: ['./qr-login-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrLoginDialogComponent implements OnInit {
  public helpLink: string;
  public qrEncryptedSeed: string;

  constructor(
    private authService: AuthService,
  ) {
  }

  public ngOnInit(): void {
    const encryptedSeed = this.authService.getActiveUserInstant().encryptedSeed;

    this.qrEncryptedSeed = `decentr://login?encryptedSeed=${encryptedSeed}`

    this.helpLink = helpLink;
  }
}
