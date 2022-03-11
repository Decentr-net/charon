import { defer, from, merge, mergeMap, Observable, Subject, tap } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
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
    const listener = async (tabId: number) => {
      const tab = await Browser.tabs.get(tabId);
      subscriber.next(tab);
    };

    Browser.tabs.onUpdated.addListener(listener);

    return () => Browser.tabs.onUpdated.removeListener(listener);
  });
};

export const onTabActivated = (): Observable<Browser.Tabs.Tab> => {
  return new Observable((subscriber) => {
    const listener = async (changeInfo: Browser.Tabs.OnActivatedActiveInfoType) => {
      const tab = await Browser.tabs.get(changeInfo.tabId);
      subscriber.next(tab);
    };

    Browser.tabs.onActivated.addListener(listener);

    return () => Browser.tabs.onActivated.removeListener(listener);
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
      if (!tabTrackMap.has(tab.id) || dontNeedUpdate() || !tab.active) {
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
    merge(
      defer(() => Browser.tabs.query({ pinned: false })).pipe(
        mergeMap(from),
      ),
      onTabCreated(),
      onTabUpdated(),
      onTabActivated(),
    ).pipe(
      filter((tab) => tab.active),
      tap((tab) => addTab(tab)),
    ),
    merge(
      onTabUpdated().pipe(
        filter((tab) => !tab.active),
        map((tab) => tab.id),
      ),
      onTabRemoved(),
    ).pipe(
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
