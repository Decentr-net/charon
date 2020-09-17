import { ChangeDetectionStrategy, Component, HostBinding, TrackByFunction } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { shuffleArray } from '../../../shared/utils/array';
import { PublicRoute } from '../../public-route';
import { SECRET_PHRASE_KEY } from '../secret-phrase/secret-phrase.component';

@Component({
  selector: 'app-secret-phrase-confirmation-page',
  templateUrl: './secret-phrase-confirmation-page.component.html',
  styleUrls: ['./secret-phrase-confirmation-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecretPhraseConfirmationPageComponent {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public seedPhraseShuffledArr = [];
  public selectedSeedPhraseArr = [];
  public isUserPhraseValid: boolean = false;

  public readonly publicRoute: typeof PublicRoute = PublicRoute;

  private readonly seedPhrase: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    const currentNavigationState = this.router.getCurrentNavigation().extras.state;
    if (currentNavigationState) {
      this.seedPhrase = currentNavigationState[SECRET_PHRASE_KEY];
      this.seedPhraseShuffledArr = shuffleArray(this.seedPhrase.split(' ').slice());
    }
  }

  public trackByWord: TrackByFunction<string> = ({}, word) => word;

  public back(): void {
    this.router.navigate(['../', PublicRoute.SecretPhrase], {
      relativeTo: this.activatedRoute,
      state: {
        [SECRET_PHRASE_KEY]: this.seedPhrase,
      },
    });
  }

  public onSelectWord(i: number, from, to) {
    to.push(from.splice(i, 1));
    this.validatePhrase();
  }

  private validatePhrase(): void {
    this.isUserPhraseValid = this.selectedSeedPhraseArr.join(' ') === this.seedPhrase;
  }
}
