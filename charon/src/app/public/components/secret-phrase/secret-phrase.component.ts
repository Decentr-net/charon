import { Component, OnInit } from '@angular/core';

export enum SeedPhrasePages {
  GET_PHRASE = 'getPhrase',
  CONFIRM_PHRASE = 'confirmPhrase',
  CONGRATULATIONS = 'congratulations'
}

@Component({
  selector: 'app-secret-phrase',
  templateUrl: './secret-phrase.component.html',
  styleUrls: ['./secret-phrase.component.scss']
})
export class SecretPhraseComponent implements OnInit {

  isPageVisible = {
    [SeedPhrasePages.GET_PHRASE]: true,
    [SeedPhrasePages.CONFIRM_PHRASE]: false,
    [SeedPhrasePages.CONGRATULATIONS]: false
  };

  isSeedPhraseVisible = false;
  isSelectedSeedPhraseValid = false;
  seedPhrase = '';

  seedPhraseShuffledArr = [];
  selectedSeedPhraseArr = [];

  ngOnInit() {
    // TODO: add service
    this.seedPhrase = 'enemy money update snake wood soda depend shine visit lion frequent two';
    this.seedPhraseShuffledArr = this.shuffleArray(this.seedPhrase.split(' ').slice());
  }

  onSwitchPage(page: string) {
    for (const key in this.isPageVisible) {
      if (this.isPageVisible.hasOwnProperty(key)) {
        this.isPageVisible[key] = key === page;
      }
    }
  }

  showSeedPhrase() {
    this.isSeedPhraseVisible = true;
  }

  onSelectWord(i: number, from, to) {
    to.push(from.splice(i, 1));

    this.checkSelectedPhrase();
  }

  checkSelectedPhrase() {
    this.isSelectedSeedPhraseValid = this.selectedSeedPhraseArr.join(' ') === this.seedPhrase;
  }

  shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  get SeedPhrasePages() {
    return SeedPhrasePages;
  }
}
