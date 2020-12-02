import { ChangeDetectionStrategy, Component } from '@angular/core';

import { HUB_HEADER_CONTENT_SLOT } from '../../components/hub-header';

@Component({
  selector: 'app-posts-page',
  templateUrl: './posts-page.component.html',
  styleUrls: ['./posts-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsPageComponent {
  public headerContentSlotName = HUB_HEADER_CONTENT_SLOT;
}
