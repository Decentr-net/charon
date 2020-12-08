import { filter, mergeMap, take, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { fromEvent, Subscription, timer } from 'rxjs';

import { MessageBus } from '../../../shared/message-bus';
import { TOOLBAR_CLOSE } from '../../toolbar/src/app/messages';
import { createToolbarIframe, createToolbarShiftSpacer } from './content/toolbar';
import { isTopWindow } from './helpers/window';
import { isAuthorized$ } from './content/auth';
import { isToolbarClosed, saveToolbarClosed } from './content/session';
import { updateShiftContent } from './helpers/shift-content';

if (!isToolbarClosed()) {
  const toolbarHeight = '33px';
  const toolbarIframe = createToolbarIframe(toolbarHeight);
  const toolbarShiftSpacer = createToolbarShiftSpacer(toolbarHeight);
  let oldHref = document.location.href;

  let scroll$: Subscription = Subscription.EMPTY;
  let fullScreen$: Subscription = Subscription.EMPTY;

  const close$ = new MessageBus().onMessage(TOOLBAR_CLOSE).pipe(
    take(1),
  );

  const observer: MutationObserver = new MutationObserver(() => {
    if (oldHref === document.location.href) {
      return;
    }

    oldHref = document.location.href;
    setTimeout(() => updateShiftContent(toolbarHeight), 200);
  });

  const addToolbar = () => {
    const mutationObserverConfig: MutationObserverInit = {
      childList: true,
      subtree: true
    };

    fullScreen$ = fromEvent(document, 'fullscreenchange').subscribe(() => {
      document.fullscreenElement ? removeToolbar() : addToolbar();
    });

    scroll$ = timer(2500).pipe(
      tap(() => {
        document.body.append(toolbarIframe);
        document.body.prepend(toolbarShiftSpacer);

        updateShiftContent(toolbarHeight);
        observer.observe(document.body, mutationObserverConfig);
      }),
      mergeMap(() => fromEvent(document, 'scroll')),
      throttleTime(400)
    ).subscribe(() => updateShiftContent(toolbarHeight));
  };

  const removeToolbar = () => {
    observer.disconnect();
    scroll$.unsubscribe();

    toolbarIframe.remove();
    toolbarShiftSpacer.remove();
    updateShiftContent();
  };

  close$.subscribe(() => {
    removeToolbar();
    saveToolbarClosed();
  });

  isAuthorized$().pipe(
    filter(() => isTopWindow(window.self)),
    takeUntil(close$),
  ).subscribe((isAuthorized) => {
    if (isAuthorized) {
      addToolbar();
    } else {
      removeToolbar();
      fullScreen$.unsubscribe();
    }
  });
}
