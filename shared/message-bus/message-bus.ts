import { Observable } from 'rxjs';
import * as Browser from 'webextension-polyfill';

export interface MessageMap {
  [code: string]: {
    body?: unknown;
    response?: unknown;
  };
}

interface MessageSent<T extends MessageMap, MessageCode extends keyof T> {
  body?: T[MessageCode]['body'];
  code: MessageCode;
}

export interface MessageGotSync<T extends MessageMap, MessageCode extends keyof T> {
  body: T[MessageCode]['body'];
  sender: Browser.Runtime.MessageSender;
}

export interface MessageGot<T extends MessageMap, MessageCode extends keyof T> extends MessageGotSync<T, MessageCode> {
  sendResponse: (response: T[MessageCode]['response']) => void;
}

type MessageSourceListener<T extends MessageMap, MessageCode extends keyof T> = (
  message: MessageSent<T, MessageCode>,
  sender,
) => Promise<T[MessageCode]['response']> | void;

type MessageSource<T extends MessageMap, MessageCode extends keyof T>
  = Browser.Events.Event<MessageSourceListener<T, MessageCode>>;

export class MessageBus<T extends MessageMap> {
  public sendMessage<MessageCode extends keyof T = keyof T>(
    code: MessageCode,
    body?: T[MessageCode]['body'],
  ): Promise<T[MessageCode]['response']> {
    const messageSent: MessageSent<T, MessageCode> = { code, body };

    return Browser.runtime.sendMessage(messageSent).catch(() => void 0);
  }

  public onMessage<MessageCode extends keyof T>(messageCode: MessageCode): Observable<MessageGot<T, MessageCode>> {
    return this.buildOnMessageListener(Browser.runtime.onMessage, messageCode);
  }

  public onMessageSync<MessageCode extends keyof T>(messageCode: MessageCode): Observable<MessageGotSync<T, MessageCode>> {
    return this.buildOnMessageListener(Browser.runtime.onMessage, messageCode, true);
  }

  private buildOnMessageListener<MessageCode extends keyof T>(
    source: MessageSource<T, MessageCode>,
    messageCode: MessageCode,
  ): Observable<MessageGot<T, MessageCode>>;

  private buildOnMessageListener<MessageCode extends keyof T>(
    source: MessageSource<T, MessageCode>,
    messageCode: MessageCode,
    sync: true,
  ): Observable<MessageGotSync<T, MessageCode>>;

  private buildOnMessageListener<MessageCode extends keyof T>(
    source: MessageSource<T, MessageCode>,
    messageCode: MessageCode,
    sync?: boolean,
  ): Observable<MessageGot<T, MessageCode> | MessageGotSync<T, MessageCode>> {
    return new Observable((subscriber) => {
      const listener: MessageSourceListener<T, MessageCode> = (message, sender) => {

        if (message.code !== messageCode) {
          return;
        }

        return sync
          ? subscriber.next({ body: message.body, sender })
          : new Promise((resolve) => subscriber.next({
            body: message.body,
            sender,
            sendResponse: resolve,
          }));
      };

      source.addListener(listener);

      return () => source.removeListener(listener);
    });
  }
}
