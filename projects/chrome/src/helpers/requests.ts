import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { browser, WebRequest } from 'webextension-polyfill-ts';

import OnBeforeRequestDetailsType = WebRequest.OnBeforeRequestDetailsType;
import OnBeforeRequestDetailsTypeRequestBodyType = WebRequest.OnBeforeRequestDetailsTypeRequestBodyType;
import OnBeforeRedirectDetailsType = WebRequest.OnBeforeRedirectDetailsType;
import OnCompletedDetailsType = WebRequest.OnCompletedDetailsType;
import RequestFilter = WebRequest.RequestFilter;
import { objectContains } from './object';

const BASE_REQUEST_FILTER: RequestFilter = {
  urls: ['<all_urls>'],
  types: ['main_frame', 'xmlhttprequest'],
};

export const listenRequestsOnBeforeSend = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
): Observable<OnBeforeRequestDetailsType> => {
  return new Observable<OnBeforeRequestDetailsType>((subscriber) => {
    const listener = (requestDetails: OnBeforeRequestDetailsType) => subscriber.next(requestDetails);

    browser.webRequest.onBeforeRequest.addListener(
      listener,
      {
        ...BASE_REQUEST_FILTER,
        ...requestFilter,
      },
      ['requestBody'],
    );

    return () => browser.webRequest.onBeforeRequest.removeListener(listener);
  }).pipe(
    filter((details) => !httpMethod || (details.method === httpMethod)),
  );
};

export const listenRequestsOnBeforeRedirect = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
): Observable<OnBeforeRedirectDetailsType> => {
  return new Observable<OnBeforeRedirectDetailsType>((subscriber) => {
    const listener = (requestDetails: OnBeforeRedirectDetailsType) => subscriber.next(requestDetails);

    browser.webRequest.onBeforeRedirect.addListener(
      listener,
      {
        ...BASE_REQUEST_FILTER,
        ...requestFilter,
      },
    );

    return () => browser.webRequest.onBeforeRedirect.removeListener(listener);
  }).pipe(
    filter((details) => !httpMethod || (details.method === httpMethod))
  );
};

export const listenRequestsBeforeRedirectWithBody = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
): Observable<OnBeforeRequestDetailsType> => {
  return new Observable<OnBeforeRequestDetailsType>((subscriber) => {
    const requestsStore = new Map<string, OnBeforeRequestDetailsType>();
    const unsubscribe$: Subject<void> = new Subject();

    listenRequestsOnBeforeSend(requestFilter, httpMethod).pipe(
      takeUntil(unsubscribe$),
    ).subscribe(details => requestsStore.set(details.requestId, details));

    listenRequestsOnBeforeRedirect(requestFilter, httpMethod).pipe(
      filter((details) => requestsStore.has(details.requestId)),
      map((details) => requestsStore.get(details.requestId)),
      tap((details) => requestsStore.delete(details.requestId)),
      filter((details) => !!details.requestBody),
      takeUntil(unsubscribe$),
    ).subscribe((details) => subscriber.next(details));

    return () => unsubscribe$.next();
  });
};

export const listenRequestsOnCompleted = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
): Observable<OnCompletedDetailsType> => {
  return new Observable<OnCompletedDetailsType>((subscriber) => {
    const listener = (requestDetails: OnCompletedDetailsType) => subscriber.next(requestDetails);

    browser.webRequest.onBeforeRequest.addListener(
      listener,
      {
        ...BASE_REQUEST_FILTER,
        ...requestFilter,
      },
    );

    return () => browser.webRequest.onCompleted.removeListener(listener);
  }).pipe(
    filter((details) => !httpMethod || (details.method === httpMethod))
  );
};

export const listenRequestsOnCompletedWithBody = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
): Observable<OnBeforeRequestDetailsType> => {
  return new Observable<OnBeforeRequestDetailsType>((subscriber) => {
    const requestsStore = new Map<string, OnBeforeRequestDetailsType>();
    const unsubscribe$: Subject<void> = new Subject();

    listenRequestsOnBeforeSend(requestFilter, httpMethod).pipe(
      takeUntil(unsubscribe$),
    ).subscribe(details => requestsStore.set(details.requestId, details));

    listenRequestsOnCompleted(requestFilter, httpMethod).pipe(
      filter((details) => requestsStore.has(details.requestId)),
      map((details) => requestsStore.get(details.requestId)),
      tap((details) => requestsStore.delete(details.requestId)),
      filter((details) => !!details.requestBody),
      takeUntil(unsubscribe$),
    ).subscribe((details) => subscriber.next(details));

    return () => unsubscribe$.next();
  });
};

export const requestBodyContains = (
  requestBody: OnBeforeRequestDetailsTypeRequestBodyType,
  searchValues: string[],
): boolean => {
  const formData = requestBody.formData || {};
  return objectContains(formData, searchValues, false);
};
