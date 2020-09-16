import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    this.router.navigate(['../', PublicRoute.SecretPhraseConfirmation], {
      relativeTo: this.activatedRoute,
      state: {
        [SECRET_PHRASE_KEY]: this.seedPhrase,
      },
    });
  }
}
