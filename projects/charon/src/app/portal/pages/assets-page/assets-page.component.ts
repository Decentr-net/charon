import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Navigation, Router } from '@angular/router';
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
    height: '24px',
    marginBottom: '24px',
    width: '100%',
  };

  public readonly portalRoute: typeof PortalRoute = PortalRoute;

  public lastTransferTime: number;

  constructor(
    private assetsPageService: AssetsPageService,
    private router: Router,
    private svgIconRegistry: SvgIconRegistry,
  ) {
    super(assetsPageService);

    svgIconRegistry.register([
      svgAdd,
      svgSend,
    ]);

    this.lastTransferTime = this.getLastTransferTime(this.router.getCurrentNavigation());
  }

  public ngOnInit(): void {
    this.assetsList$ = this.assetsPageService.getAssets();
  }

  private getLastTransferTime(navigation: Navigation): number | undefined {
    return navigation?.extras?.state?.lastTransferTime;
  }
}
