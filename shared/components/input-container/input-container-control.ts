import { Observable } from 'rxjs';

export abstract class InputContainerControl {
  abstract touched: Observable<void>;
}
