import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgAdd, svgSend } from '@shared/svg-icons';
import { InfiniteLoadingPresenter } from '@shared/utils/infinite-loading';
import { TokenTransaction } from '../../components/token-transactions-table';
import { Asset } from './assets-page.definitions';
import { AssetsPageService } from './assets-page.service';
import { PortalRoute } from '../../portal-route';

@Component({
  selector: 'app-assets-page',
  templateUrl: './assets-page.component.html',
  styleUrls: ['./assets-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AssetsPageService,
  ],
})
export class AssetsPageComponent
  extends InfiniteLoadingPresenter<TokenTransaction>
  implements OnInit
{
  public assetsList$: Observable<Asset[]>;

  public readonly skeletonLoaderTheme = {
    height: '48px',
    marginBottom: '0',
    width: '100%'
  };

  public readonly portalRoute: typeof PortalRoute = PortalRoute;

  constructor(
    private assetsPageService: AssetsPageService,
    private svgIconRegistry: SvgIconRegistry,
  ) {
    super(assetsPageService);

    svgIconRegistry.register([
      svgAdd,
      svgSend,
    ]);
  }

  public ngOnInit() {
    this.assetsList$ = this.assetsPageService.getAssets();
  }
}
