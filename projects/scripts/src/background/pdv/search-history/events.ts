import { Observable } from 'rxjs';
import { browser, Tabs } from 'webextension-polyfill-ts';
import { SearchHistoryPDV } from 'decentr-js';
import OnUpdatedChangeInfoType = Tabs.OnUpdatedChangeInfoType;

import { SEARCH_ENGINES } from './engines';

export type SearchQuery = Pick<SearchHistoryPDV, 'engine' | 'domain' | 'query'>;

export const listenSearchQueries = (): Observable<SearchQuery> => {
  return new Observable((subscriber) => {
    const listener = ({}, changeInfo: OnUpdatedChangeInfoType) => {
      const url = changeInfo.url;

      if (!url) {
        return;
      }

      const searchEngine = SEARCH_ENGINES.find((engine) => engine.urlRegex.test(url));

      if (!searchEngine) {
        return;
      }

      const domain = new URL(url).hostname;
      const query = new URL(url).searchParams.get(searchEngine.queryParam);

      if (query) {
        subscriber.next({
          domain,
          query,
          engine: searchEngine.engine,
        });
      }
    };

    browser.tabs.onUpdated.addListener(listener);

    return () => browser.tabs.onUpdated.removeListener(listener);
  });
};
