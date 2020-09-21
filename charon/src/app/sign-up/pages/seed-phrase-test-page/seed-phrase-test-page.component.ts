import { ChangeDetectionStrategy, Component, HostBinding, TrackByFunction } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { shuffleArray } from '../../../shared/utils/array';
import { SignUpRoute } from '../../sign-up-route';
import { SECRET_PHRASE_KEY } from '../seed-phrase-page';

@Component({
  selector: 'app-seed-phrase-test-page',
  templateUrl: './seed-phrase-test-page.component.html',
  styleUrls: ['./seed-phrase-test-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedPhraseTestPageComponent {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public seedPhraseShuffledArr = [];
  public selectedSeedPhraseArr = [];
  public isUserPhraseValid: boolean = false;

  public readonly signUpRoute: typeof SignUpRoute = SignUpRoute;

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
    this.router.navigate(['../', SignUpRoute.SeedPhrase], {
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
