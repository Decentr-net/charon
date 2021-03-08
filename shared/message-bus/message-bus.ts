import { Observable } from 'rxjs';
import { browser, Runtime, Tabs } from 'webextension-polyfill-ts';
import Tab = Tabs.Tab;

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
  sender: Runtime.MessageSender;
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

    return browser.runtime.sendMessage(messageSent).catch(() => void 0);
  }

  // available only in background script (Firefox)
  public sendMessageToCurrentTab<MessageCode extends keyof T = keyof T>(
    code: MessageCode,
    body?: T[MessageCode]['body']
  ): Promise<T[MessageCode]['response']> {
    const messageSent: MessageSent<T, MessageCode> = { code, body };

    return browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      return browser.tabs.sendMessage(tabs[0].id, messageSent);
    });
  }

  // available only in background script (Firefox)
  public sendMessageToTabs<MessageCode extends keyof T = keyof T>(
    tabIds: Tab['id'][],
    code: MessageCode,
    body?: T[MessageCode]['body']
  ): Promise<T[MessageCode]['response'][]> {
    const messageSent: MessageSent<T, MessageCode> = { code, body };

    return browser.tabs.query({ currentWindow: true }).then((tabs) => {
      const receivers = tabs.filter((tab) => tabIds.includes(tab.id));

      if (!receivers.length) {
        return Promise.resolve([]);
      }

      return Promise.all(receivers.map(({ id }) => browser.tabs.sendMessage(id, messageSent)));
    });
  }

  public onMessage<MessageCode extends keyof T>(messageCode: MessageCode): Observable<MessageGot<T, MessageCode>> {
    return new Observable((subscriber) => {
      const listener: (
        message: MessageSent<T, MessageCode>,
        sender: Runtime.MessageSender,
      ) => Promise<T[MessageCode]['response']> | void = (message, sender) => {

        if (message.code !== messageCode) {
          return;
        }

        return new Promise((resolve) => subscriber.next(({
          sender,
          body: message.body,
          sendResponse: resolve,
        })));
      }

      browser.runtime.onMessage.addListener(listener);

      return () => browser.runtime.onMessage.removeListener(listener);
    });
  }

  public onMessageSync<MessageCode extends keyof T>(messageCode: MessageCode): Observable<MessageGotSync<T, MessageCode>> {
    return new Observable((subscriber) => {
      const listener: (
        message: MessageSent<T, MessageCode>,
        sender: Runtime.MessageSender,
      ) => Promise<T[MessageCode]['response']> | void = (message, sender) => {

        if (message.code !== messageCode) {
          return;
        }

        subscriber.next({
          sender,
          body: message.body,
        });
      }

      browser.runtime.onMessage.addListener(listener);

      return () => browser.runtime.onMessage.removeListener(listener);
    });
  }
}
