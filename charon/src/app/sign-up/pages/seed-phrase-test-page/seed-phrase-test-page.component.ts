import { ChangeDetectionStrategy, Component, HostBinding, OnInit, TrackByFunction } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { NavigationService } from '@shared/services/navigation/navigation.service';
import { shuffleArray } from '@shared/utils/array';
import { SignUpRoute } from '../../sign-up-route';
import { SignUpService } from '../../services';
import { EMAIL_QUERY_PARAM } from '../email-confirmation-page';

@UntilDestroy()
@Component({
  selector: 'app-seed-phrase-test-page',
  templateUrl: './seed-phrase-test-page.component.html',
  styleUrls: ['./seed-phrase-test-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedPhraseTestPageComponent implements OnInit {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public seedPhraseShuffledArr = [];
  public selectedSeedPhraseArr = [];
  public isUserPhraseValid: boolean = false;

  private seedPhrase: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navigationService: NavigationService,
    private router: Router,
    private signUpService: SignUpService,
  ) {
  }

  public ngOnInit() {
    this.seedPhrase = this.signUpService.getSeedPhrase();
    this.seedPhraseShuffledArr = shuffleArray(this.seedPhrase.split(' ').slice());
  }

  public trackByWord: TrackByFunction<string> = ({}, word) => word;

  public back(): void {
    this.navigationService.getPreviousUrl();
  }

  public onSelectWord(i: number, from, to) {
    to.push(from.splice(i, 1));
    this.validatePhrase();
  }

  public signUp(): void {
    this.signUpService.signUp().pipe(
      untilDestroyed(this),
    ).subscribe((user) => {
      this.router.navigate(['../', SignUpRoute.EmailConfirmation], {
        relativeTo: this.activatedRoute,
        queryParams: {
          [EMAIL_QUERY_PARAM]: user.emails[0],
        },
      })
    })
  }

  private validatePhrase(): void {
    this.isUserPhraseValid = this.selectedSeedPhraseArr.join(' ') === this.seedPhrase;
  }
}
