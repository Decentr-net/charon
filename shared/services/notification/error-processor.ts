import { Observable } from 'rxjs';

export abstract class ErrorProcessor {
  public abstract process(error: unknown): Observable<string> | string;
}

export abstract class ConcreteErrorProcessor extends ErrorProcessor {
  public abstract canProcess(error: unknown): boolean;
}
