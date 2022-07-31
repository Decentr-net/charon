import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgLoud } from '@shared/svg-icons/loud';
import { svgReferral } from '@shared/svg-icons/referral';

@Component({
  selector: 'app-seed-phrase',
  templateUrl: './seed-phrase.component.html',
  styleUrls: ['./seed-phrase.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedPhraseComponent {
  @Input() public seedPhrase: string;

  @Output() public readonly back: EventEmitter<void> = new EventEmitter();

  @Output() public readonly next: EventEmitter<void> = new EventEmitter();

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgLoud,
      svgReferral,
    ]);
  }

  public onBack(): void {
    this.back.emit();
  }

  public onNext(): void {
    this.next.emit();
  }
}
