import { Observable } from 'rxjs';
import { browser, Tabs } from 'webextension-polyfill-ts';
import OnUpdatedChangeInfoType = Tabs.OnUpdatedChangeInfoType;

import { SEARCH_ENGINES } from './engines';

export interface SearchQuery {
  engine: string;
  query: string;
}

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

      const query = new URL(url).searchParams.get(searchEngine.queryParam);

      if (query) {
        subscriber.next({
          query,
          engine: searchEngine.engine,
        });
      }
    };

    browser.tabs.onUpdated.addListener(listener);

    return () => browser.tabs.onUpdated.removeListener(listener);
  });
};
