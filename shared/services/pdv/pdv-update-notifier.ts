import { Observable, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, mapTo, repeat, takeUntil } from 'rxjs/operators';
import { Tabs } from 'webextension-polyfill-ts';
import Tab = Tabs.Tab;

import { MessageBus } from '../../message-bus';

const messageCode = 'CHARON_PDV_UPDATE';

export class PDVUpdateNotifier {
  private readonly resetTimer$: Subject<void> = new Subject();

  private static readonly messageBus = new MessageBus();

  private timerSubscription: Subscription;

  public static listen(): Observable<void> {
    return PDVUpdateNotifier.messageBus.onMessage(messageCode)
      .pipe(
        debounceTime(1000),
        mapTo(void 0),
      );
  }

  public notify(tabIds: Tab['id'][]): Promise<void[]> {
    this.resetTimer$.next();

    return PDVUpdateNotifier.messageBus.sendMessageToTabs(tabIds, messageCode);
  }

  public start(options: { interval?: number, tabIds: Tab['id'][] }): void {
    this.stop();

    const interval = options.interval || 1000 * 60;

    this.timerSubscription = timer(interval, interval)
      .pipe(
        takeUntil(this.resetTimer$),
        repeat(),
      )
      .subscribe(() => {
        this.notify(options.tabIds);
      });
  }

  public stop(): void {
    if (this.timerSubscription && !this.timerSubscription.closed) {
      this.timerSubscription.unsubscribe();
    }
  }
}
