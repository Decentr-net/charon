import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgDecentrHub } from '@shared/svg-icons';
import { BankCoin } from 'decentr-js';

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetsListComponent {
  @Input() balance: BankCoin['amount'];

  @Output() public selected: EventEmitter<void> = new EventEmitter();

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register(svgDecentrHub);
  }

  public select(): void {
    this.selected.emit();
  }
}
