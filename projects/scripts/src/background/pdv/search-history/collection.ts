import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PDVType, SearchHistoryPDV } from 'decentr-js';

import { ONE_SECOND } from '../../../../../../shared/utils/date';
import { listenSearchQueries } from './events';

export const listenSearchHistoryPDVs = (): Observable<SearchHistoryPDV> => {
  return listenSearchQueries().pipe(
    map((searchQuery) => ({
      ...searchQuery,
      type: PDVType.SearchHistory,
      timestamp: Math.round((Date.now() / ONE_SECOND)).toString(),
    })),
  );
}
