import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { isOpenedInTab } from '@shared/utils/browser';
import { StakingRoute } from '../../staking-route';
import { ValidatorDefinition } from '../../models';
import { ValidatorDetailsPageService } from './validator-details-page.service';

@Component({
  selector: 'app-validator-details-page',
  templateUrl: './validator-details-page.component.html',
  styleUrls: ['./validator-details-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ValidatorDetailsPageService,
  ],
})
export class ValidatorDetailsPageComponent implements OnInit {
  public isTabView = isOpenedInTab();

  public stakingRoute: typeof StakingRoute = StakingRoute;

  public validatorDetails$: Observable<ValidatorDefinition>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private validatorDetailsPageService: ValidatorDetailsPageService,
  ) {
  }

  public ngOnInit(): void {
    this.validatorDetails$ = this.activatedRoute.params.pipe(
      mergeMap((params) => this.validatorDetailsPageService.getValidator(params[StakingRoute.ValidatorAddressParam])),
      catchError(() => {
        this.router.navigate(['../'], {
          relativeTo: this.activatedRoute,
          skipLocationChange: true,
        });

        return EMPTY;
      }),
    );
  }

  public navigateTo(route: StakingRoute): void {
    this.router.navigate([route], {
      relativeTo: this.activatedRoute,
    });
  }
}
