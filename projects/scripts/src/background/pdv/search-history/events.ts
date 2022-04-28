import { Observable } from 'rxjs';
import * as Browser from 'webextension-polyfill';
import { SearchHistoryPDV } from 'decentr-js';

import { SEARCH_ENGINES } from './engines';

export type SearchQuery = Pick<SearchHistoryPDV, 'engine' | 'domain' | 'query'>;

export const listenSearchQueries = (): Observable<SearchQuery> => {
  return new Observable((subscriber) => {
    const listener = async (tabId: number, changeInfo: Browser.Tabs.OnUpdatedChangeInfoType) => {
      if (changeInfo.status !== 'complete') {
        return;
      }

      const tab = await Browser.tabs.get(tabId)
        .catch(() => undefined);

      if (!tab?.active) {
        return;
      }

      const url = tab.url;

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

    Browser.tabs.onUpdated.addListener(listener);

    return () => Browser.tabs.onUpdated.removeListener(listener);
  });
};
