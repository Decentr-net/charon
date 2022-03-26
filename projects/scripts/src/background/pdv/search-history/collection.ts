import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PDVType, SearchHistoryPDV } from 'decentr-js';

import { listenSearchQueries } from './events';

export const listenSearchHistoryPDVs = (): Observable<SearchHistoryPDV> => {
  return listenSearchQueries().pipe(
    map((searchQuery) => ({
      ...searchQuery,
      type: PDVType.SearchHistory,
      timestamp: new Date().toISOString(),
    })),
  );
};
