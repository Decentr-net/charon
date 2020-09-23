import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  seedPhrase = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    // TODO: add service
    this.seedPhrase = 'enemy money update snake wood soda depend shine visit lion frequent two';
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
