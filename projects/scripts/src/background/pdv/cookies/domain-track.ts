import { merge, Observable, Subject, tap } from 'rxjs';
import { distinctUntilChanged, map, startWith } from 'rxjs/operators';
import * as Browser from 'webextension-polyfill';

import { ONE_SECOND } from '../../../../../../shared/utils/date';

const DOMAIN_TRACK_TIME = ONE_SECOND * 5;

const EXCLUDED_URL_PARTS = ['chrome://', 'decentr://', 'decentr-extension://'];

export const onTabCreated = (): Observable<Browser.Tabs.Tab> => {
  return new Observable((subscriber) => {
    const listener = (tab: Browser.Tabs.Tab) => subscriber.next(tab);

    Browser.tabs.onCreated.addListener(listener);

    return () => Browser.tabs.onCreated.removeListener(listener);
  });
};

export const onTabUpdated = (): Observable<Browser.Tabs.Tab> => {
  return new Observable((subscriber) => {
    const listener = (tabId: number, changeInfo: Browser.Tabs.OnUpdatedChangeInfoType, tab: Browser.Tabs.Tab) => {
      if (changeInfo.url) {
        subscriber.next(tab);
      }
    };

    Browser.tabs.onUpdated.addListener(listener);

    return () => Browser.tabs.onUpdated.removeListener(listener);
  });
};

export const onTabRemoved = (): Observable<number> => {
  return new Observable((subscriber) => {
    const listener = (tabId: number) => subscriber.next(tabId);

    Browser.tabs.onRemoved.addListener(listener);

    return () => Browser.tabs.onRemoved.removeListener(listener);
  });
};

const getTabDomain = (tabUrl: string): string | undefined => {
  try {
    return new URL(tabUrl).hostname;
  } catch {
    return undefined;
  }
};

export const trackDomains = (): Observable<string[]> => {
  const tabTrackMap = new Map<number, string | undefined>();
  const tabTrackMapChange$ = new Subject<void>();

  const addTab = (tab: Browser.Tabs.Tab) => {
    const tabDomain = getTabDomain(tab.url);
    const dontNeedUpdate = () => tabTrackMap.get(tab.id) === tabDomain;

    if (
      !tabDomain
      || dontNeedUpdate()
      || EXCLUDED_URL_PARTS.some((urlPart) => tab.url.includes(urlPart))
    ) {
      return;
    }

    tabTrackMap.set(tab.id, undefined);
    tabTrackMapChange$.next();

    setTimeout(() => {
      if (!tabTrackMap.has(tab.id) || dontNeedUpdate()) {
        return;
      }

      tabTrackMap.set(tab.id, tabDomain);
      tabTrackMapChange$.next();
    }, DOMAIN_TRACK_TIME);
  };

  const removeTab = (tabId: number) => {
    tabTrackMap.delete(tabId);
    tabTrackMapChange$.next();
  };

  const trackProcess$ = merge(
    onTabCreated().pipe(
      tap((tab) => addTab(tab)),
    ),
    onTabUpdated().pipe(
      tap((tab) => addTab(tab)),
    ),
    onTabRemoved().pipe(
      tap((tabId) => removeTab(tabId)),
    ),
  );

  const domains$ = tabTrackMapChange$.pipe(
    startWith(void 0),
    map(() => [...new Set(tabTrackMap.values())].filter(Boolean)),
    distinctUntilChanged((prev, curr) => prev.join() === curr.join()),
  );

  return new Observable<string[]>((subscriber) => {
    const trackSubscription = trackProcess$.subscribe();
    const domainsSubscription = domains$.subscribe(subscriber);

    return () => {
      tabTrackMapChange$.complete();
      trackSubscription.unsubscribe();
      domainsSubscription.unsubscribe();
    };
  });
};
