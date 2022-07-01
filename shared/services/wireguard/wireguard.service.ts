import Browser from 'webextension-polyfill';
import { map } from 'rxjs/operators';

import {
  ConnectMessage,
  ConnectMessageResponse,
  ConnectParamsRequest,
  DisconnectMessage,
  DisconnectMessageResponse,
  IsWgInstalledMessage,
  IsWgInstalledResponse,
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

  private sendMessage<T>(message: Message): Promise<T> {
    return Browser.runtime.sendNativeMessage(HOST_APP_WIREGUARD, message);
  }

  public async connect(params: ConnectParamsRequest): Promise<ConnectMessageResponse> {
    const request: ConnectMessage = {
      type: MessageType.CONNECT,
      params,
    };

    const response = await this.sendMessage<ConnectMessageResponse>(request);
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

    const response = await this.sendMessage<DisconnectMessageResponse>(request);
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

    return this.sendMessage<StatusMessageResponse>(request).then((response) => {
      console.log('Status response: ', response);

      return response;
    });
  }

  public isWgInstalled(): Promise<IsWgInstalledResponse> {
    const request: IsWgInstalledMessage = {
      type: MessageType.IS_WG_INSTALLED,
    };

    // TODO: remove
    return Promise.resolve(({ result: true }) as IsWgInstalledResponse);

    return this.sendMessage<IsWgInstalledResponse>(request);
  }

  public onStatusChanges(): Observable<boolean> {
    return this.messageBus.onMessageSync(WIREGUARD_STATUS_CHANGED).pipe(
      map((message) => message.body),
    );
  }
}
