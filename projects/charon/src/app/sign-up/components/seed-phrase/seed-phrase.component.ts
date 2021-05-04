import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-seed-phrase',
  templateUrl: './seed-phrase.component.html',
  styleUrls: ['./seed-phrase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedPhraseComponent {
  @Input() public seedPhrase: string;

  @Output() public readonly next: EventEmitter<void> = new EventEmitter();

  public isSeedPhraseDownloaded = false;
  public isSeedPhraseVisible = false;

  public downloadSeedPhrase(): void {
    this.isSeedPhraseDownloaded = true;
  }

  public onNext(): void {
    this.next.emit();
  }

  public showSeedPhrase(): void {
    this.isSeedPhraseVisible = true;
  }
}
