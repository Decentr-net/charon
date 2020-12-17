import { Observable } from 'rxjs';

export abstract class ErrorProcessor {
  public abstract process(error: any): Observable<string> | string;
}

export abstract class ConcreteErrorProcessor extends ErrorProcessor {
  public abstract canProcess(error: any): boolean;
}
