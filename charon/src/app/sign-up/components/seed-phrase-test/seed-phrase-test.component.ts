import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TrackByFunction,
} from '@angular/core';

import { shuffleArray } from '@shared/utils/array';

@Component({
  selector: 'app-seed-phrase-test',
  templateUrl: './seed-phrase-test.component.html',
  styleUrls: ['./seed-phrase-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedPhraseTestComponent implements OnInit {
  @Input() public seedPhrase: string;
  @Output() public readonly confirmed: EventEmitter<void> = new EventEmitter();

  public seedPhraseShuffledArr = [];
  public selectedSeedPhraseArr = [];
  public isUserPhraseValid: boolean = false;

  public ngOnInit() {
    this.seedPhraseShuffledArr = shuffleArray(this.seedPhrase.split(' ').slice());
  }

  public trackByWord: TrackByFunction<string> = ({}, word) => word;

  public onSelectWord(i: number, from, to) {
    to.push(from.splice(i, 1));
    this.validatePhrase();
  }

  public confirm(): void {
    this.confirmed.emit();
  }

  private validatePhrase(): void {
    this.isUserPhraseValid = this.selectedSeedPhraseArr.join(' ') === this.seedPhrase;
  }
}
