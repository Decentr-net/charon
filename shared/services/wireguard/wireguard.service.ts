import Browser from 'webextension-polyfill';
import { map, mergeMap, startWith } from 'rxjs/operators';

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
    body: void;
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
    await this.notifyStatusChanged();

    return response;
  }

  public async disconnect(): Promise<DisconnectMessageResponse> {
    const request: DisconnectMessage = {
      type: MessageType.DISCONNECT,
    };

    const response = await this.sendMessage<DisconnectMessageResponse>(request);
    await this.notifyStatusChanged();

    return response;
  }

  public status(): Promise<StatusMessageResponse> {
    const request: StatusMessage = {
      type: MessageType.STATUS,
    };

    return this.sendMessage<StatusMessageResponse>(request);
  }

  public isWgInstalled(): Promise<IsWgInstalledResponse> {
    const request: IsWgInstalledMessage = {
      type: MessageType.IS_WG_INSTALLED,
    };

    return this.sendMessage<IsWgInstalledResponse>(request);
  }

  public notifyStatusChanged(): Promise<void> {
    return this.messageBus.sendMessage(WIREGUARD_STATUS_CHANGED).then(() => undefined);
  }

  public onStatusChanges(): Observable<boolean> {
    return this.messageBus.onMessageSync(WIREGUARD_STATUS_CHANGED).pipe(
      startWith(null),
      mergeMap(() => this.status()),
      map((response) => response.result),
    );
  }
}
