import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CryptoService } from '../../../shared/services/crypto';
import { SignUpRoute } from '../../sign-up-route';

export const SECRET_PHRASE_KEY = 'SECRET_PHRASE';

@Component({
  selector: 'app-seed-phrase-page',
  templateUrl: './seed-phrase-page.component.html',
  styleUrls: ['./seed-phrase-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedPhrasePageComponent implements OnInit {
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
      this.seedPhrase = CryptoService.generateMnemonic();
    }
  }

  showSeedPhrase() {
    this.isSeedPhraseVisible = true;
  }

  public switchToConfirmationPage(): void {
    this.router.navigate(['../', SignUpRoute.SeedPhraseTest], {
      relativeTo: this.activatedRoute,
      state: {
        [SECRET_PHRASE_KEY]: this.seedPhrase,
      },
    });
  }
}
