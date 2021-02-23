import { interval, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { browser, Events, WebRequest } from 'webextension-polyfill-ts';

import OnBeforeRequestDetailsType = WebRequest.OnBeforeRequestDetailsType;
import OnBeforeRequestDetailsTypeRequestBodyType = WebRequest.OnBeforeRequestDetailsTypeRequestBodyType;
import OnBeforeRedirectDetailsType = WebRequest.OnBeforeRedirectDetailsType;
import OnCompletedDetailsType = WebRequest.OnCompletedDetailsType;
import RequestFilter = WebRequest.RequestFilter;
import { objectContains } from '../helpers/object';
import { ONE_SECOND } from '../../../../shared/utils/date';

const BASE_REQUEST_FILTER: RequestFilter = {
  urls: ['<all_urls>'],
  types: ['main_frame', 'xmlhttprequest'],
};

type RequestDetails = OnBeforeRequestDetailsType | OnBeforeRedirectDetailsType | OnCompletedDetailsType;

type RequestDetailsStreamFn<T extends RequestDetails> = (
  requestFilter: Partial<RequestFilter>,
  httpMethod?: string,
) => Observable<T>;

const listenRequestsDetails = <T extends RequestDetails>(
  event: Events.Event<(details: T) => void>,
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
  listenerExtraParams?: any[],
): Observable<T> => {
  return new Observable<T>((subscriber) => {
    const listener = (requestDetails: T) => {
      if (!httpMethod || (requestDetails.method === httpMethod)) {
        subscriber.next(requestDetails);
      }
    };

    event.addListener(
      listener,
      {
        ...BASE_REQUEST_FILTER,
        ...requestFilter,
      },
      listenerExtraParams,
    );

    return () => event.removeListener(listener);
  });
}

const listenRequestsOnBeforeSend: RequestDetailsStreamFn<OnBeforeRequestDetailsType> = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
): Observable<OnBeforeRequestDetailsType> => {
  return listenRequestsDetails(
    browser.webRequest.onBeforeRequest,
    requestFilter,
    httpMethod,
    ['requestBody'],
  );
};

const listenRequestsOnBeforeRedirect: RequestDetailsStreamFn<OnBeforeRequestDetailsType> = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
): Observable<OnBeforeRedirectDetailsType> => {
  return listenRequestsDetails(browser.webRequest.onBeforeRedirect, requestFilter, httpMethod);
};

const listenRequestsOnCompleted: RequestDetailsStreamFn<OnCompletedDetailsType> = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
): Observable<OnCompletedDetailsType> => {
  return listenRequestsDetails(browser.webRequest.onCompleted, requestFilter, httpMethod);
};

const listenRequestsWithBody = <T extends RequestDetails>(
  requestEndStreamFn: RequestDetailsStreamFn<T>,
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
): Observable<OnBeforeRequestDetailsType> => {
  return new Observable<OnBeforeRequestDetailsType>((subscriber) => {
    const requestsStore = new Map<string, { timestamp: number, details: OnBeforeRequestDetailsType }>();
    const unsubscribe$: Subject<void> = new Subject();

    listenRequestsOnBeforeSend(requestFilter, httpMethod).pipe(
      filter((details) => !!details.requestBody),
      takeUntil(unsubscribe$),
    ).subscribe(details => requestsStore.set(details.requestId, { timestamp: Date.now(), details }));

    requestEndStreamFn(requestFilter, httpMethod).pipe(
      filter((details) => requestsStore.has(details.requestId)),
      map((details) => requestsStore.get(details.requestId).details),
      tap((details) => requestsStore.delete(details.requestId)),
      takeUntil(unsubscribe$),
    ).subscribe((details) => subscriber.next(details));

    interval(ONE_SECOND * 30).pipe(
      takeUntil(unsubscribe$),
    ).subscribe(() => {
      const keysToRemove = [];
      requestsStore.forEach((value, key) => {
        if (value.timestamp < Date.now() - ONE_SECOND * 30) {
          keysToRemove.push(key);
        }
      });

      keysToRemove.forEach((key) => requestsStore.delete(key));
    });

    return () => unsubscribe$.next();
  });
}

export const listenRequestsBeforeRedirectWithBody = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
): Observable<OnBeforeRequestDetailsType> => {
  return listenRequestsWithBody(listenRequestsOnBeforeRedirect, requestFilter, httpMethod);
};

export const listenRequestsOnCompletedWithBody = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
): Observable<OnBeforeRequestDetailsType> => {
  return listenRequestsWithBody(listenRequestsOnCompleted, requestFilter, httpMethod);
};

export const requestBodyContains = (
  requestBody: OnBeforeRequestDetailsTypeRequestBodyType,
  searchValues: string[],
): boolean => {
  const formData = requestBody.formData || {};
  return objectContains(formData, searchValues, false);
};
