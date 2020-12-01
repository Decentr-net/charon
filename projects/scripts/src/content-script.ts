import { filter, take, takeUntil } from 'rxjs/operators';

import { MessageBus } from '../../../shared/message-bus';
import { TOOLBAR_CLOSE } from '../../toolbar/src/app/messages';
import { isTopWindow } from './helpers/window';
import { isAuthorized$ } from './content/auth';
import { isToolbarClosed, saveToolbarClosed } from './content/session';
import { createToolbarIframe } from './content/toolbar';

if (!isToolbarClosed()) {
  const iframe = createToolbarIframe();

  const close$ = new MessageBus().onMessage(TOOLBAR_CLOSE).pipe(
    take(1),
  );

  close$.subscribe(() => {
    iframe.remove();
    saveToolbarClosed();
  });

  isAuthorized$().pipe(
    filter(() => isTopWindow(window.self)),
    takeUntil(close$),
  ).subscribe((isAuthorized) => {
    isAuthorized
      ? document.documentElement.append(iframe)
      : iframe.remove();
  });
}
