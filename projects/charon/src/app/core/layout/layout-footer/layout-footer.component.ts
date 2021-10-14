import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgDiscord } from '@shared/svg-icons/discord';
import { svgGithub } from '@shared/svg-icons/github';
import { svgLogoIcon } from '@shared/svg-icons/logo-icon';
import { svgMedium } from '@shared/svg-icons/medium';
import { svgTelegram } from '@shared/svg-icons/telegram';
import { svgTwitter } from '@shared/svg-icons/twitter';

interface SocialLink {
  iconKey: string;
  title: string;
  url: string;
}

@Component({
  selector: 'app-layout-footer',
  templateUrl: './layout-footer.component.html',
  styleUrls: ['./layout-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutFooterComponent {
  public readonly currentYear: number = new Date().getFullYear();

  public readonly socialLinks: SocialLink[] = [
    {
      iconKey: svgGithub.name,
      title: 'GitHub',
      url: 'https://github.com/Decentr-net',
    },
    {
      iconKey: svgTelegram.name,
      title: 'Telegram',
      url: 'https://t.me/DecentrNet',
    },
    {
      iconKey: svgTwitter.name,
      title: 'Twitter',
      url: 'https://twitter.com/decentrnet',
    },
    {
      iconKey: svgMedium.name,
      title: 'Medium',
      url: 'https://decentrnet.medium.com/',
    },
    {
      iconKey: svgDiscord.name,
      title: 'Discord',
      url: 'https://discord.gg/VMUt7yw92B',
    },
  ];

  constructor(
    svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register([
      svgDiscord,
      svgGithub,
      svgLogoIcon,
      svgMedium,
      svgTelegram,
      svgTwitter,
    ]);
  }
}
