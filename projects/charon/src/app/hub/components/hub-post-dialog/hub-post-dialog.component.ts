import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { UserPermissions } from '@core/permissions';
import { PostWithAuthor } from '../../models/post';
import { svgTrash } from '@shared/svg-icons';

@Component({
  selector: 'app-hub-post-dialog',
  templateUrl: './hub-post-dialog.component.html',
  styleUrls: ['./hub-post-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubPostDialogComponent {
  public readonly permissions: typeof UserPermissions = UserPermissions;

  constructor(
    @Inject(MAT_DIALOG_DATA) public post$: Observable<PostWithAuthor>,
    private svgIconRegistry: SvgIconRegistry,
  ) {
    svgIconRegistry.register(svgTrash);
  }
}
