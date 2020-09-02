import { Component } from '@angular/core';

@Component({
  selector: 'app-secret-phrase',
  templateUrl: './secret-phrase.component.html',
  styleUrls: ['./secret-phrase.component.scss']
})
export class SecretPhraseComponent {

  isSeedPhraseVisible = false;
  seedPhrase = 'enemy money update snake wood soda depend shine visit lion frequent two';

  showBackupPhrase() {
    this.isSeedPhraseVisible = true;
  }
}
