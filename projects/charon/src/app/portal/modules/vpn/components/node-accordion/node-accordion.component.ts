import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  TrackByFunction,
  ContentChild,
  TemplateRef,
} from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { flagsIcons } from '@shared/svg-icons/flags';
import { NodeAccordionContentDirective } from './node-accordion-content.directive';
import { SentinelNodeExtendedDetails } from '../../pages/vpn-page/vpn-page.definitions';

@Component({
  selector: 'app-node-accordion',
  templateUrl: './node-accordion.component.html',
  styleUrls: ['./node-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeAccordionComponent implements OnInit {
  @Input() public nodes: SentinelNodeExtendedDetails[];

  @Input() public isConnectedToWireguard: boolean;

  @ContentChild(NodeAccordionContentDirective, { read: TemplateRef })
  public contentTemplateRef: TemplateRef<{ node: SentinelNodeExtendedDetails }>;

  public trackByNodeAddress: TrackByFunction<SentinelNodeExtendedDetails> = ({}, { address }) => address;

  constructor(
    private svgIconRegistry: SvgIconRegistry,
  ) { }

  public ngOnInit(): void {
    this.svgIconRegistry.register([
      ...flagsIcons,
    ]);
  }
}
