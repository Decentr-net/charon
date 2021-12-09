import { EMPTY, Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { PostIdentificationParameters } from 'decentr-js';

import { uuid } from '../../../../../shared/utils/uuid';

export enum WebpageAPIRequestMessageCode {
  OpenPost = 'WEBPAGE_API_OPEN_POST',
}

export enum WebpageAPIResponseMessageCode {
  OpenPost = 'WEBPAGE_API_OPEN_POST_RESPONSE',
}

export interface WebpageAPIRequestMessageMap {
  [WebpageAPIRequestMessageCode.OpenPost]: {
    networkId: string;
    post: PostIdentificationParameters;
  };
}

export class WebpageAPIResponseErrorMessage {
  constructor(public readonly webpageAPIError: any) {
  }
}

export const isWebpageAPIResponseErrorMessage = (obj: unknown): obj is WebpageAPIResponseErrorMessage => {
  return !!(obj as WebpageAPIResponseErrorMessage)?.webpageAPIError;
};

interface WebpageAPIResponseMessageMap {
  [WebpageAPIResponseMessageCode.OpenPost]: void;
}

interface WebpageAPIMessageCodeMap {
  [WebpageAPIRequestMessageCode.OpenPost]: WebpageAPIResponseMessageCode.OpenPost;
}

const WebpageAPI_MESSAGE_CODE_MAP: WebpageAPIMessageCodeMap = {
  [WebpageAPIRequestMessageCode.OpenPost]: WebpageAPIResponseMessageCode.OpenPost,
};

export type WebpageAPIResponseOf<T extends keyof WebpageAPIRequestMessageMap> = WebpageAPIResponseMessageMap[WebpageAPIMessageCodeMap[T]];

interface WebpageAPIRequest<T extends keyof WebpageAPIRequestMessageMap> {
  body: WebpageAPIRequestMessageMap[T];
  sendResponse: (response: WebpageAPIResponseErrorMessage | WebpageAPIResponseOf<T>) => void;
}

type WebpageAPIMessageMap = WebpageAPIRequestMessageMap & WebpageAPIResponseMessageMap;

interface WebpageAPIMessage<T extends keyof WebpageAPIMessageMap> {
  body: WebpageAPIMessageMap[T];
  code: T;
  id: string;
}

export class WebpageAPIMessageBus {
  public sendRequest<T extends keyof WebpageAPIRequestMessageMap>(
    code: T,
    body: WebpageAPIRequestMessageMap[T],
  ): Observable<WebpageAPIResponseOf<T>> {
    const id = uuid();
    const message: WebpageAPIMessage<T> = { code, body, id } as WebpageAPIMessage<T>;

    this.postMessage(message);

    return this.onResponse(code, id).pipe(
      map((response) => {
        if (isWebpageAPIResponseErrorMessage(response)) {
          throw response.webpageAPIError;
        }

        return response;
      }),
    );
  }

  public onRequest<T extends WebpageAPIRequestMessageCode>(
    code: T,
  ): Observable<WebpageAPIRequest<T>> {
    return this.onMessage(code).pipe(
      map((message) => ({
        body: message.body,
        sendResponse: (response: WebpageAPIResponseErrorMessage | WebpageAPIResponseOf<T>) => this.sendResponseFor(code, response, message.id),
      })),
    );
  }

  private sendResponseFor<T extends keyof WebpageAPIRequestMessageMap>(
    code: T,
    body: WebpageAPIResponseErrorMessage | WebpageAPIResponseOf<T>,
    id: string,
  ): void {
    const message: WebpageAPIMessage<T> = {
      code: WebpageAPI_MESSAGE_CODE_MAP[code],
      body,
      id,
    } as unknown as WebpageAPIMessage<T>;

    this.postMessage(message);
  }

  private onResponse<T extends keyof WebpageAPIRequestMessageMap>(
    requestCode: T,
    id: string,
  ): Observable<WebpageAPIResponseOf<T> | WebpageAPIResponseErrorMessage> {
    return WebpageAPI_MESSAGE_CODE_MAP[requestCode]
      ? this.onMessage(WebpageAPI_MESSAGE_CODE_MAP[requestCode], id).pipe(
        pluck('body'),
      )
      : EMPTY;
  }

  private onMessage<T extends keyof (WebpageAPIRequestMessageMap & WebpageAPIResponseMessageMap)>(
    code: T,
    id?: string | number,
  ): Observable<WebpageAPIMessage<T>> {
    return new Observable((subscriber) => {
      const listener = (message: MessageEvent<WebpageAPIMessage<T>>) => {
        if (message.data?.code === code && (!id || message.data?.id === id)) {
          subscriber.next(message.data);
        }
      };

      window.addEventListener('message', listener);

      return () => window.removeEventListener('message', listener);
    });
  }

  private postMessage(message: WebpageAPIMessage<WebpageAPIResponseMessageCode | WebpageAPIRequestMessageCode>): void {
    window.postMessage(message, '*');
  }
}
