import { Observable } from 'rxjs';
import { browser, Runtime } from 'webextension-polyfill-ts';

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

export interface MessageGot<T extends MessageMap, MessageCode extends keyof T> {
  body: T[MessageCode]['body'];
  sendResponse: (response: T[MessageCode]['response']) => void;
}

export class MessageBus<T extends MessageMap> {
  public sendMessage<MessageCode extends keyof T = keyof T>(
    code: MessageCode,
    body?: T[MessageCode]['body']
  ): Promise<T[MessageCode]['response']> {
    const messageSent: MessageSent<T, MessageCode> = { code, body };

    return browser.runtime.sendMessage(messageSent);
  }

  // available only in background script (Firefox)
  public sendMessageToTabs<MessageCode extends keyof T = keyof T>(
    code: MessageCode,
    body?: T[MessageCode]['body']
  ): Promise<T[MessageCode]['response'][]> {
    const messageSent: MessageSent<T, MessageCode> = { code, body };

    return browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      return Promise.all(
        tabs.map(({ id }) => browser.tabs.sendMessage(id, messageSent))
      );
    });
  }

  public onMessage<MessageCode extends keyof T>(messageCode: MessageCode): Observable<MessageGot<T, MessageCode>> {
    return new Observable((subscriber) => {
      const listener: (
        message: MessageSent<T, MessageCode>,
        sender: Runtime.MessageSender,
      ) => Promise<T[MessageCode]['response']> | void = (message) => {

        if (message.code !== messageCode) {
          return;
        }

        return new Promise((resolve) => subscriber.next(({
          body: message.body,
          sendResponse: resolve,
        })));
      }

      browser.runtime.onMessage.addListener(listener);

      return () => browser.runtime.onMessage.removeListener(listener);
    });
  }
}
