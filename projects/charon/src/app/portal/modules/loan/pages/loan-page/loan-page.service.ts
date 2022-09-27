import { Injectable } from '@angular/core';
import { DecentrService, PDVService } from '@core/services';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class LoanPageService {

  constructor(
    private decentrService: DecentrService,
    private pdvService: PDVService,
  ) {
  }

  public getPdvRate(): Observable<string> {
    return this.pdvService.getBalance();
  }

  public requestLoan(request): Observable<void> {
    return this.decentrService.vulcanClient.pipe(
      switchMap((vulcanClient) => vulcanClient.loan.requestLoan(request)),
    );
  }
}
