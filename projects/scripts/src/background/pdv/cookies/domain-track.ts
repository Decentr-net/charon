import {
  BehaviorSubject,
  combineLatest,
  defer,
  from,
  merge,
  mergeMap,
  Observable,
  tap,
} from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import * as Browser from 'webextension-polyfill';

import { ONE_SECOND } from '../../../../../../shared/utils/date';

const DOMAIN_TRACK_TIME = ONE_SECOND * 5;

export const onTabCreated = (): Observable<Browser.Tabs.Tab> => {
  return new Observable((subscriber) => {
    const listener = (tab: Browser.Tabs.Tab) => subscriber.next(tab);

    Browser.tabs.onCreated.addListener(listener);

    return () => Browser.tabs.onCreated.removeListener(listener);
  });
};

export const onTabUpdated = (): Observable<Browser.Tabs.Tab> => {
  return new Observable((subscriber) => {
    const listener = async (tabId: number, changeInfo: Browser.Tabs.OnUpdatedChangeInfoType) => {
      try {
        if (changeInfo.status !== 'complete') {
          return;
        }

        const tab = await Browser.tabs.get(tabId);
        subscriber.next(tab);
      } catch {}
    };

    Browser.tabs.onUpdated.addListener(listener);

    return () => Browser.tabs.onUpdated.removeListener(listener);
  });
};

export const onTabActivated = (): Observable<Browser.Tabs.Tab> => {
  return new Observable((subscriber) => {
    const listener = async (changeInfo: Browser.Tabs.OnActivatedActiveInfoType) => {
      try {
        const tab = await Browser.tabs.get(changeInfo.tabId);
        subscriber.next(tab);
      } catch {}
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

interface TabInfo {
  domain: string;
  approved: boolean;
}

export interface TrackedDomains {
  all: string[];
  approved: string[];
}

export const trackDomains = (): Observable<TrackedDomains> => {
  const tabTrackMap = new Map<number, TabInfo>();
  const tabTrackMapChange$ = new BehaviorSubject<Map<number, TabInfo>>(tabTrackMap);

  const tabApproveTimeoutMap = new Map<number, number>();

  const resetApproveTimeout = (tabId: number) => {
    clearTimeout(tabApproveTimeoutMap.get(tabId));
    tabApproveTimeoutMap.delete(tabId);
  };

  const addTab = (tab: Browser.Tabs.Tab) => {
    const domain = getTabDomain(tab.url);

    if (
      !domain
      || tabTrackMap.get(tab.id)?.domain === domain
    ) {
      return;
    }

    resetApproveTimeout(tab.id);

    tabTrackMap.set(tab.id, { domain, approved: false });
    tabTrackMapChange$.next(tabTrackMap);
  };

  const removeTab = (tabId: number) => {
    resetApproveTimeout(tabId);

    tabTrackMap.delete(tabId);
    tabTrackMapChange$.next(tabTrackMap);
  };

  const startApproveTab = (tab: Browser.Tabs.Tab) => {
    const approveTimeout = window.setTimeout(() => {
      if (!tabTrackMap.has(tab.id) || tabTrackMap.get(tab.id).approved || !tab.active) {
        return;
      }

      resetApproveTimeout(tab.id);

      tabTrackMap.set(tab.id, { ...tabTrackMap.get(tab.id), approved: true });
      tabTrackMapChange$.next(tabTrackMap);
    }, DOMAIN_TRACK_TIME);

    tabApproveTimeoutMap.set(tab.id, approveTimeout);
  };

  const unapproveOtherTabs = (activeTabId: number) => {
    [...tabTrackMap.keys()]
      .filter((tabId) => tabId !== activeTabId)
      .forEach((tabId) => {
        resetApproveTimeout(tabId);
        tabTrackMap.set(tabId, { ...tabTrackMap.get(tabId), approved: false });
      });

    tabTrackMapChange$.next(tabTrackMap);
  };

  const trackProcess$ = merge(
    merge(
      defer(() => Browser.tabs.query({ pinned: false })).pipe(
        mergeMap(from),
      ),
      onTabCreated(),
      onTabUpdated(),
    ).pipe(
      tap((tab) => addTab(tab)),
    ),
    merge(
      defer(() => Browser.tabs.query({ active: true })).pipe(
        mergeMap(from),
      ),
      onTabUpdated().pipe(
        filter((tab) => tab.active),
      ),
      onTabActivated().pipe(
        tap((tab) => unapproveOtherTabs(tab.id)),
      ),
    ).pipe(
      tap((tab) => startApproveTab(tab)),
    ),
    merge(
      onTabRemoved(),
    ).pipe(
      tap((tabId) => removeTab(tabId)),
    ),
  );

  const distinctDomains = (source$: Observable<string[]>): Observable<string[]> => {
    return source$.pipe(
      map((domains) => [...new Set(domains.sort())]),
      distinctUntilChanged((prev, curr) => prev.join() === curr.join()),
    );
  };

  const allDomains$: Observable<string[]> = tabTrackMapChange$.pipe(
    map((tabMap) => [...tabMap.values()].map(({ domain }) => domain)),
    distinctDomains,
  );

  const approvedDomains$: Observable<string[]> = tabTrackMapChange$.pipe(
    map((tabMap) => [...tabMap.values()]
      .filter(({ approved }) => approved)
      .map(({ domain }) => domain),
    ),
    distinctDomains,
  );

  return new Observable((subscriber) => {
    const trackSubscription = trackProcess$.subscribe();
    const domainsSubscription = combineLatest([
      allDomains$,
      approvedDomains$,
    ]).pipe(
      map(([all, approved]: [string[], string[]]) => ({ all, approved })),
    ).subscribe(subscriber);

    return () => {
      tabTrackMapChange$.complete();
      trackSubscription.unsubscribe();
      domainsSubscription.unsubscribe();
    };
  });
};
