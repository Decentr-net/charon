import { merge, mergeMap, Observable, Subject, tap } from 'rxjs';
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

export const onTabUpdated = (): Observable<number> => {
  return new Observable((subscriber) => {
    const listener = (tabId: number) => subscriber.next(tabId);

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

const getTabDomain = (tab: Browser.Tabs.Tab) => new URL(tab.url).hostname;

export const trackDomains = (): Observable<string[]> => {
  const tabTrackMap = new Map<number, string | undefined>();

  const tabTrackMapChange$ = new Subject<void>();

  const domains$ = tabTrackMapChange$.pipe(
    startWith(void 0),
    map(() => [...new Set(tabTrackMap.values())].filter(Boolean)),
    distinctUntilChanged((prev, curr) => prev.join() === curr.join()),
  );

  const removeTab = (tabId: number) => {
    tabTrackMap.delete(tabId);
    tabTrackMapChange$.next();
  };

  const addTab = (tab: Browser.Tabs.Tab) => {
    if (
      !tab.url
      || tabTrackMap.get(tab.id) === getTabDomain(tab)
      || EXCLUDED_URL_PARTS.some((urlPart) => tab?.url.includes(urlPart))
    ) {
      return;
    }

    tabTrackMap.set(tab.id, undefined);
    tabTrackMapChange$.next();

    setTimeout(() => {
      if (!tabTrackMap.has(tab.id)) {
        return;
      }

      tabTrackMap.set(tab.id, getTabDomain(tab));
      tabTrackMapChange$.next();
    }, DOMAIN_TRACK_TIME);
  };

  const trackProcess$ = merge(
    onTabCreated().pipe(
      tap((tab) => addTab(tab)),
    ),
    onTabUpdated().pipe(
      mergeMap((tabId) => Browser.tabs.get(tabId)),
      tap((tab: Browser.Tabs.Tab) => addTab(tab)),
    ),
    onTabRemoved().pipe(
      tap((tabId) => removeTab(tabId)),
    ),
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
