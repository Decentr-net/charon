import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Navigation, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SvgIconRegistry } from '@ngneat/svg-icon';

import { svgAdd } from '@shared/svg-icons/add';
import { svgSend } from '@shared/svg-icons/send';
import { isOpenedInTab } from '@shared/utils/browser';
import { InfiniteLoadingPresenter } from '@shared/utils/infinite-loading';
import { PortalRoute } from '../../../../portal-route';
import { TokenTransactionMessage } from '../../components/token-transactions-table';
import { Asset } from './assets-page.definitions';
import { AssetsPageService } from './assets-page.service';

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
  extends InfiniteLoadingPresenter<TokenTransactionMessage>
  implements OnInit
{
  public readonly isOpenedInTab: boolean = isOpenedInTab();

  public assetsList$: Observable<Asset[]>;

  public readonly skeletonLoaderTheme = {
    height: '24px',
    marginBottom: '24px',
    width: '100%',
  };

  public readonly portalRoute: typeof PortalRoute = PortalRoute;

  public lastTransferTime: number;

  public totalCount$: Observable<number>;

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

    this.totalCount$ = of(1);
  }

  private getLastTransferTime(navigation: Navigation): number | undefined {
    return navigation?.extras?.state?.lastTransferTime;
  }
}
