import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post, SwapDetails, SwapListPaginationOptions, Wallet } from 'decentr-js';

import { NetworkId } from '../../../../../shared/services/configuration/config.definitions';
import { uuid } from '../../../../../shared/utils/uuid';

export enum WebpageAPIRequestMessageCode {
  Connect = 'WEBPAGE_API_CONNECT',
  CreateSwap = 'WEBPAGE_API_CREATE_SWAP',
  GetBalance = 'WEBPAGE_API_GET_BALANCE',
  GetNetwork = 'WEBPAGE_API_GET_NETWORK',
  GetSwapById = 'WEBPAGE_API_GET_SWAP_BY_ID',
  GetSwapList = 'WEBPAGE_API_GET_SWAP_LIST',
  GetWalletAddress = 'WEBPAGE_API_GET_WALLET_ADDRESS',
  IsConnected = 'WEBPAGE_API_IS_CONNECTED',
  OpenPost = 'WEBPAGE_API_OPEN_POST',
}

export enum WebpageAPIResponseMessageCode {
  CreateSwap = 'WEBPAGE_API_CREATE_SWAP_RESPONSE',
  GetBalance = 'WEBPAGE_API_GET_BALANCE_RESPONSE',
  GetNetwork = 'WEBPAGE_API_GET_NETWORK_RESPONSE',
  GetSwapById = 'WEBPAGE_API_GET_SWAP_BY_ID_RESPONSE',
  GetSwapList = 'WEBPAGE_API_GET_SWAP_LIST_RESPONSE',
  GetWalletAddress = 'WEBPAGE_API_GET_WALLET_ADDRESS_RESPONSE',
  IsConnected = 'WEBPAGE_API_IS_CONNECTED_RESPONSE',
  OpenPost = 'WEBPAGE_API_OPEN_POST_RESPONSE',
}

export interface WebpageAPIRequestMessageMap {
  [WebpageAPIRequestMessageCode.Connect]: undefined;
  [WebpageAPIRequestMessageCode.CreateSwap]: {
    receiverAddress: Wallet['address'];
    txHash: string;
    signature: string;
  };
  [WebpageAPIRequestMessageCode.GetBalance]: undefined;
  [WebpageAPIRequestMessageCode.GetNetwork]: undefined;
  [WebpageAPIRequestMessageCode.GetSwapById]: SwapDetails['id'];
  [WebpageAPIRequestMessageCode.GetSwapList]: SwapListPaginationOptions;
  [WebpageAPIRequestMessageCode.GetWalletAddress]: undefined;
  [WebpageAPIRequestMessageCode.IsConnected]: undefined;
  [WebpageAPIRequestMessageCode.OpenPost]: {
    networkId: NetworkId;
    post: Pick<Post, 'owner' | 'uuid'>;
  };
}

export class WebpageAPIResponseErrorMessage {
  constructor(public readonly webpageAPIError: any) {
  }
}

export const isWebpageAPIResponseErrorMessage = (obj: unknown): obj is WebpageAPIResponseErrorMessage => {
  return !!(obj as WebpageAPIResponseErrorMessage)?.webpageAPIError;
};

export interface WebpageAPIResponseMessageMap {
  [WebpageAPIResponseMessageCode.CreateSwap]: SwapDetails;
  [WebpageAPIResponseMessageCode.GetBalance]: string;
  [WebpageAPIResponseMessageCode.GetNetwork]: NetworkId;
  [WebpageAPIResponseMessageCode.GetSwapById]: SwapDetails;
  [WebpageAPIResponseMessageCode.GetSwapList]: SwapDetails[];
  [WebpageAPIResponseMessageCode.GetWalletAddress]: string;
  [WebpageAPIResponseMessageCode.IsConnected]: boolean;
  [WebpageAPIResponseMessageCode.OpenPost]: void;
}

interface WebpageAPIMessageCodeMap {
  [WebpageAPIRequestMessageCode.Connect]: undefined;
  [WebpageAPIRequestMessageCode.CreateSwap]: WebpageAPIResponseMessageCode.CreateSwap;
  [WebpageAPIRequestMessageCode.GetBalance]: WebpageAPIResponseMessageCode.GetBalance;
  [WebpageAPIRequestMessageCode.GetNetwork]: WebpageAPIResponseMessageCode.GetNetwork;
  [WebpageAPIRequestMessageCode.GetSwapById]: WebpageAPIResponseMessageCode.GetSwapById;
  [WebpageAPIRequestMessageCode.GetSwapList]: WebpageAPIResponseMessageCode.GetSwapList;
  [WebpageAPIRequestMessageCode.GetWalletAddress]: WebpageAPIResponseMessageCode.GetWalletAddress;
  [WebpageAPIRequestMessageCode.IsConnected]: WebpageAPIResponseMessageCode.IsConnected;
  [WebpageAPIRequestMessageCode.OpenPost]: WebpageAPIResponseMessageCode.OpenPost;
}

const WEBPAGE_API_MESSAGE_CODE_MAP: WebpageAPIMessageCodeMap = {
  [WebpageAPIRequestMessageCode.Connect]: undefined,
  [WebpageAPIRequestMessageCode.CreateSwap]: WebpageAPIResponseMessageCode.CreateSwap,
  [WebpageAPIRequestMessageCode.GetBalance]: WebpageAPIResponseMessageCode.GetBalance,
  [WebpageAPIRequestMessageCode.GetNetwork]: WebpageAPIResponseMessageCode.GetNetwork,
  [WebpageAPIRequestMessageCode.GetSwapById]: WebpageAPIResponseMessageCode.GetSwapById,
  [WebpageAPIRequestMessageCode.GetSwapList]: WebpageAPIResponseMessageCode.GetSwapList,
  [WebpageAPIRequestMessageCode.GetWalletAddress]: WebpageAPIResponseMessageCode.GetWalletAddress,
  [WebpageAPIRequestMessageCode.IsConnected]: WebpageAPIResponseMessageCode.IsConnected,
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
      code: WEBPAGE_API_MESSAGE_CODE_MAP[code],
      body,
      id,
    } as unknown as WebpageAPIMessage<T>;

    this.postMessage(message);
  }

  private onResponse<T extends keyof WebpageAPIRequestMessageMap>(
    requestCode: T,
    id: string,
  ): Observable<WebpageAPIResponseOf<T> | WebpageAPIResponseErrorMessage> {
    return WEBPAGE_API_MESSAGE_CODE_MAP[requestCode]
      ? this.onMessage(WEBPAGE_API_MESSAGE_CODE_MAP[requestCode], id).pipe(
        map(({ body }) => body)
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
