import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mnemonic } from 'decentr-js';
import { PublicRoute } from '../../public-route';

export const SECRET_PHRASE_KEY = 'SECRET_PHRASE';

@Component({
  selector: 'app-secret-phrase',
  templateUrl: './secret-phrase.component.html',
  styleUrls: ['./secret-phrase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecretPhraseComponent implements OnInit {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  isSeedPhraseVisible = false;
  public seedPhrase: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    const currentNavigationState = this.router.getCurrentNavigation().extras.state;
    if (currentNavigationState) {
      this.seedPhrase = currentNavigationState[SECRET_PHRASE_KEY];
    }
  }

  ngOnInit() {
    if (!this.seedPhrase) {
      this.seedPhrase = new Mnemonic().generate();
    }
  }

  showSeedPhrase() {
    this.isSeedPhraseVisible = true;
  }

  public switchToConfirmationPage(): void {
    this.router.navigate(['../', PublicRoute.SecretPhraseConfirmation], {
      relativeTo: this.activatedRoute,
      state: {
        [SECRET_PHRASE_KEY]: this.seedPhrase,
      },
    });
  }
}
