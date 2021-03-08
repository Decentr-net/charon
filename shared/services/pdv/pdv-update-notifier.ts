import { Observable, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, mapTo, repeat, takeUntil } from 'rxjs/operators';

import { MessageBus } from '../../message-bus';

const messageCode = 'CHARON_PDV_UPDATE';

export class PDVUpdateNotifier {
  private readonly resetTimer$: Subject<void> = new Subject();

  private static readonly messageBus = new MessageBus();

  private timerSubscription: Subscription;

  public static listen(): Observable<void> {
    return PDVUpdateNotifier.messageBus.onMessageSync(messageCode)
      .pipe(
        debounceTime(1000),
        mapTo(void 0),
      );
  }

  public notify(): Promise<void[]> {
    this.resetTimer$.next();

    return PDVUpdateNotifier.messageBus.sendMessage(messageCode);
  }

  public start(options?: { interval?: number }): void {
    this.stop();

    const interval = options?.interval || 1000 * 60;

    this.timerSubscription = timer(interval, interval)
      .pipe(
        takeUntil(this.resetTimer$),
        repeat(),
      )
      .subscribe(() => {
        this.notify();
      });
  }

  public stop(): void {
    if (this.timerSubscription && !this.timerSubscription.closed) {
      this.timerSubscription.unsubscribe();
    }
  }
}
