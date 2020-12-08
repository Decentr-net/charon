import { map, mergeMap, startWith, take, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { combineLatest, fromEvent, Observable, Subscription, timer } from 'rxjs';

import { MessageBus } from '../../../shared/message-bus';
import { TOOLBAR_CLOSE } from '../../toolbar/src/app/messages';
import { TOOLBAR_HEIGHT } from '../../toolbar/src/app';
import { createToolbarIframe, createToolbarShiftSpacer } from './content/toolbar';
import { isTopWindow } from './helpers/window';
import { isAuthorized$ } from './content/auth';
import { isToolbarClosed, saveToolbarClosed } from './content/session';
import { updateShiftContent } from './helpers/shift-content';

if (!isToolbarClosed() && isTopWindow(window.self)) {
  const toolbarIframe = createToolbarIframe(TOOLBAR_HEIGHT);
  const toolbarShiftSpacer = createToolbarShiftSpacer(TOOLBAR_HEIGHT);
  let oldHref = document.location.href;

  let scroll$: Subscription = Subscription.EMPTY;

  const fullScreen$ = (): Observable<boolean> => fromEvent(document, 'fullscreenchange').pipe(
    map(() => !!document.fullscreenElement),
    startWith(false)
  );

  const close$ = new MessageBus().onMessage(TOOLBAR_CLOSE).pipe(
    take(1),
  );

  const observer: MutationObserver = new MutationObserver(() => {
    if (oldHref === document.location.href) {
      return;
    }

    oldHref = document.location.href;
    setTimeout(() => updateShiftContent(TOOLBAR_HEIGHT), 200);
  });

  const addToolbar = () => {
    const mutationObserverConfig: MutationObserverInit = {
      childList: true,
      subtree: true
    };

    scroll$ = timer(2500).pipe(
      tap(() => {
        document.body.append(toolbarIframe);
        document.body.prepend(toolbarShiftSpacer);

        updateShiftContent(TOOLBAR_HEIGHT);
        observer.observe(document.body, mutationObserverConfig);
      }),
      mergeMap(() => fromEvent(document, 'scroll')),
      throttleTime(400)
    ).subscribe(() => updateShiftContent(TOOLBAR_HEIGHT));
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

  combineLatest([
    isAuthorized$(),
    fullScreen$(),
  ]).pipe(
    takeUntil(close$),
  ).subscribe(([isAuth, fullscreen]) => {
    if (isAuth && !fullscreen) {
      addToolbar();
    } else {
      removeToolbar();
    }
  });
}
