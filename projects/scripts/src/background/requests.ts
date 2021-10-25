import { interval, Observable, Subject } from 'rxjs';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import * as Browser from 'webextension-polyfill';

import OnBeforeRequestDetailsType = Browser.WebRequest.OnBeforeRequestDetailsType;
import OnBeforeRequestDetailsTypeRequestBodyType = Browser.WebRequest.OnBeforeRequestDetailsTypeRequestBodyType;
import OnBeforeRedirectDetailsType = Browser.WebRequest.OnBeforeRedirectDetailsType;
import OnCompletedDetailsType = Browser.WebRequest.OnCompletedDetailsType;
import RequestFilter = Browser.WebRequest.RequestFilter;
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

type RequestBodyFilterFn = (body: OnBeforeRequestDetailsTypeRequestBodyType) => boolean;

const listenRequestsDetails = <T extends RequestDetails>(
  event: Browser.Events.Event<(details: T) => void>,
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
};

const listenRequestsOnBeforeSend: RequestDetailsStreamFn<OnBeforeRequestDetailsType> = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
): Observable<OnBeforeRequestDetailsType> => {
  return listenRequestsDetails(
    Browser.webRequest.onBeforeRequest,
    requestFilter,
    httpMethod,
    ['requestBody'],
  );
};

const listenRequestsOnBeforeRedirect: RequestDetailsStreamFn<OnBeforeRequestDetailsType> = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
): Observable<OnBeforeRedirectDetailsType> => {
  return listenRequestsDetails(Browser.webRequest.onBeforeRedirect, requestFilter, httpMethod);
};

const listenRequestsOnCompleted: RequestDetailsStreamFn<OnCompletedDetailsType> = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
): Observable<OnCompletedDetailsType> => {
  return listenRequestsDetails(Browser.webRequest.onCompleted, requestFilter, httpMethod);
};

const listenRequestsWithBody = <T extends RequestDetails>(
  requestEndStreamFn: RequestDetailsStreamFn<T>,
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
  bodyFilterFn?: RequestBodyFilterFn,
): Observable<OnBeforeRequestDetailsType> => {
  return new Observable<OnBeforeRequestDetailsType>((subscriber) => {
    const requestsStore = new Map<string, { timestamp: number, details: OnBeforeRequestDetailsType }>();
    const unsubscribe$: Subject<void> = new Subject();

    listenRequestsOnBeforeSend(requestFilter, httpMethod).pipe(
      filter((details) => !!details.requestBody),
      filter((details) => !bodyFilterFn || bodyFilterFn(details.requestBody)),
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
};

export const listenRequestsBeforeRedirectWithBody = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
  bodyFilterFn?: RequestBodyFilterFn,
): Observable<OnBeforeRequestDetailsType> => {
  return listenRequestsWithBody(listenRequestsOnBeforeRedirect, requestFilter, httpMethod, bodyFilterFn);
};

export const listenRequestsOnCompletedWithBody = (
  requestFilter: Partial<RequestFilter> = {},
  httpMethod?: string,
  bodyFilterFn?: RequestBodyFilterFn,
): Observable<OnBeforeRequestDetailsType> => {
  return listenRequestsWithBody(listenRequestsOnCompleted, requestFilter, httpMethod, bodyFilterFn);
};

export const requestBodyContains = (
  requestBody: OnBeforeRequestDetailsTypeRequestBodyType,
  searchValues: string[],
): boolean => {
  const formData = requestBody.formData || {};
  return objectContains(formData, searchValues, false);
};
