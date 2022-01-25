import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';
import { BondStatus, Validator } from 'decentr-js';

import { validatorStatusIcons } from '@shared/svg-icons/validator-status';
import { svgBonded } from '@shared/svg-icons/validator-status/bonded';
import { svgUnbonding } from '@shared/svg-icons/validator-status/unbonding';
import { svgUnbonded } from '@shared/svg-icons/validator-status/unbonded';

const VALIDATOR_STATUS_ICON_MAP: Record<BondStatus, string> = {
  [BondStatus.BOND_STATUS_BONDED]: svgBonded.name,
  [BondStatus.BOND_STATUS_UNBONDING]: svgUnbonding.name,
  [BondStatus.BOND_STATUS_UNBONDED]: svgUnbonded.name,

  [BondStatus.BOND_STATUS_UNSPECIFIED]: '',
  [BondStatus.UNRECOGNIZED]: '',
};

@Component({
  selector: 'app-validator-status',
  templateUrl: './validator-status.component.html',
  styleUrls: ['./validator-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidatorStatusComponent implements OnInit {
  @Input() status: Validator['status'];

  @Input()
  @HostBinding('class.mod-filled')
  public filled = false;

  @HostBinding('class.mod-unbonded')
  public get isUnbonded(): boolean {
    return this.status === BondStatus.BOND_STATUS_UNBONDED;
  }

  @HostBinding('class.mod-unbonding')
  public get isUnbonding(): boolean {
    return this.status === BondStatus.BOND_STATUS_UNBONDING;
  }

  @HostBinding('class.mod-bonded')
  public get isBonded(): boolean {
    return this.status === BondStatus.BOND_STATUS_BONDED;
  }

  public readonly validatorStatus: typeof BondStatus = BondStatus;
  public validatorStatusIcon: string;

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      ...validatorStatusIcons,
    ]);
  }

  public ngOnInit(): void {
    this.validatorStatusIcon = VALIDATOR_STATUS_ICON_MAP[this.status];
  }
}
