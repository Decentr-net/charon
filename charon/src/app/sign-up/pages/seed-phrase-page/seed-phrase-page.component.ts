import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';

import { CryptoService } from '../../../shared/services/crypto';
import { SignUpRoute } from '../../sign-up-route';
import { SignUpService } from '../../services';

@Component({
  selector: 'app-seed-phrase-page',
  templateUrl: './seed-phrase-page.component.html',
  styleUrls: ['./seed-phrase-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedPhrasePageComponent implements OnInit {
  @HostBinding('class.container') public readonly useContainerClass: boolean = true;

  public signUpRoute: typeof SignUpRoute = SignUpRoute;
  isSeedPhraseVisible = false;
  public seedPhrase: string;

  constructor(
    private signUpService: SignUpService,
  ) {
  }

  ngOnInit() {
    this.seedPhrase = CryptoService.generateMnemonic();
    this.signUpService.setSeedPhrase(this.seedPhrase);
  }

  showSeedPhrase() {
    this.isSeedPhraseVisible = true;
  }
}
