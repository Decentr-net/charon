import { Observable } from 'rxjs';
import * as Browser from 'webextension-polyfill';

export interface MessageMap {
  [code: string]: {
    body?: any;
    response?: any;
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

export class MessageBus<T extends MessageMap> {
  public sendMessage<MessageCode extends keyof T = keyof T>(
    code: MessageCode,
    body?: T[MessageCode]['body']
  ): Promise<T[MessageCode]['response']> {
    const messageSent: MessageSent<T, MessageCode> = { code, body };

    return Browser.runtime.sendMessage(messageSent).catch(() => void 0);
  }

  // available only in background script (Firefox)
  public sendMessageToCurrentTab<MessageCode extends keyof T = keyof T>(
    code: MessageCode,
    body?: T[MessageCode]['body']
  ): Promise<T[MessageCode]['response']> {
    const messageSent: MessageSent<T, MessageCode> = { code, body };

    return Browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      return Browser.tabs.sendMessage(tabs[0].id, messageSent);
    });
  }

  // available only in background script (Firefox)
  public sendMessageToTabs<MessageCode extends keyof T = keyof T>(
    tabIds: Browser.Tabs.Tab['id'][],
    code: MessageCode,
    body?: T[MessageCode]['body']
  ): Promise<T[MessageCode]['response'][]> {
    const messageSent: MessageSent<T, MessageCode> = { code, body };

    return Browser.tabs.query({ currentWindow: true }).then((tabs) => {
      const receivers = tabs.filter((tab) => tabIds.includes(tab.id));

      if (!receivers.length) {
        return Promise.resolve([]);
      }

      return Promise.all(receivers.map(({ id }) => Browser.tabs.sendMessage(id, messageSent)));
    });
  }

  public onMessage<MessageCode extends keyof T>(messageCode: MessageCode): Observable<MessageGot<T, MessageCode>> {
    return new Observable((subscriber) => {
      const listener: (
        message: MessageSent<T, MessageCode>,
        sender: Browser.Runtime.MessageSender,
      ) => Promise<T[MessageCode]['response']> | void = (message, sender) => {

        if (message.code !== messageCode) {
          return;
        }

        return new Promise((resolve) => subscriber.next(({
          sender,
          body: message.body,
          sendResponse: resolve,
        })));
      };

      Browser.runtime.onMessage.addListener(listener);

      return () => Browser.runtime.onMessage.removeListener(listener);
    });
  }

  public onMessageSync<MessageCode extends keyof T>(messageCode: MessageCode): Observable<MessageGotSync<T, MessageCode>> {
    return new Observable((subscriber) => {
      const listener: (
        message: MessageSent<T, MessageCode>,
        sender: Browser.Runtime.MessageSender,
      ) => Promise<T[MessageCode]['response']> | void = (message, sender) => {

        if (message.code !== messageCode) {
          return;
        }

        subscriber.next({
          sender,
          body: message.body,
        });
      };

      Browser.runtime.onMessage.addListener(listener);

      return () => Browser.runtime.onMessage.removeListener(listener);
    });
  }
}
