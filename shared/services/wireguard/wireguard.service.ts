import Browser from 'webextension-polyfill';
import { map } from 'rxjs/operators';

import {
  ConnectMessage,
  ConnectMessageResponse,
  ConnectParamsRequest,
  DisconnectMessage,
  DisconnectMessageResponse,
  Message,
  MessageType,
  StatusMessage,
  StatusMessageResponse,
} from './wireguard.definitions';
import { Observable } from 'rxjs';
import { MessageBus, MessageMap } from '@shared/message-bus';

const HOST_APP_WIREGUARD = 'com.decentr.wireguard';
const WIREGUARD_STATUS_CHANGED = 'WIREGUARD_STATUS_CHANGED';

interface WireguardMessageMap extends MessageMap {
  WIREGUARD_STATUS_CHANGED: {
    body: boolean;
  };
}

export class WireguardService {
  private messageBus = new MessageBus<WireguardMessageMap>();

  private sendMessage<T>(appId: string, message: Message): Promise<T> {
    return Browser.runtime.sendNativeMessage(appId, message);
  }

  public async connect(params: ConnectParamsRequest): Promise<ConnectMessageResponse> {
    const request: ConnectMessage = {
      type: MessageType.CONNECT,
      params,
    };

    const response = await this.sendMessage<ConnectMessageResponse>(HOST_APP_WIREGUARD, request);
    const status = await this.status();
    await this.messageBus.sendMessage(WIREGUARD_STATUS_CHANGED, status.result);

    console.log(params);
    console.log('status', status.result);
    console.log('Connect response', response);

    return response;
  }

  public async disconnect(): Promise<DisconnectMessageResponse> {
    const request: DisconnectMessage = {
      type: MessageType.DISCONNECT,
    };

    const response = await this.sendMessage<DisconnectMessageResponse>(HOST_APP_WIREGUARD, request);
    const status = await this.status();
    await this.messageBus.sendMessage(WIREGUARD_STATUS_CHANGED, status.result);

    console.log('disconnect status', status.result);
    console.log('Disconnect response', response);

    return response;
  }

  public status(): Promise<StatusMessageResponse> {
    const request: StatusMessage = {
      type: MessageType.STATUS,
    };

    return this.sendMessage<StatusMessageResponse>(HOST_APP_WIREGUARD, request).then((response) => {
      console.log('Status response: ', response);

      return response;
    });
  }

  public onStatusChanges(): Observable<boolean> {
    return this.messageBus.onMessageSync(WIREGUARD_STATUS_CHANGED).pipe(
      map((message) => message.body),
    );
  }
}
