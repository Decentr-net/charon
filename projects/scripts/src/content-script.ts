import { finalize, map, mergeMap, startWith, take, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { combineLatest, fromEvent, merge, Observable, Subscription, timer } from 'rxjs';

import { MessageBus } from '../../../shared/message-bus';
import { TOOLBAR_HEIGHT } from '../../toolbar/src/app';
import { createToolbarIframe, createToolbarShiftSpacer } from './content/toolbar';
import { isTopWindow } from './helpers/window';
import { isAuthorized$ } from './content/auth';
import {
  getExtensionDisabledEvent,
  getToolbarEnabledState,
  isToolbarClosed,
  saveToolbarClosed
} from './content/session';
import { updateShiftContent } from './content/shift-content';
import { MessageCode } from './messages';

if (!isToolbarClosed() && isTopWindow(window.self)) {
  const toolbarIframe = createToolbarIframe(TOOLBAR_HEIGHT);
  const toolbarShiftSpacer = createToolbarShiftSpacer(TOOLBAR_HEIGHT);
  let oldHref = document.location.href;

  let scroll$: Subscription = Subscription.EMPTY;

  const fullScreen$ = (): Observable<boolean> => fromEvent(document, 'fullscreenchange').pipe(
    map(() => !!document.fullscreenElement),
    startWith(false)
  );

  const manualClose$ = new MessageBus().onMessage(MessageCode.ToolbarClose).pipe(
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

  const close$ = merge(
    manualClose$.pipe(
      tap(() => saveToolbarClosed()),
    ),
    getExtensionDisabledEvent(),
  );

  combineLatest([
    getToolbarEnabledState(),
    isAuthorized$(),
    fullScreen$(),
  ]).pipe(
    finalize(() => removeToolbar()),
    takeUntil(close$),
  ).subscribe(([isEnabled, isAuth, fullscreen]) => {
    if (isEnabled && isAuth && !fullscreen) {
      addToolbar();
    } else {
      removeToolbar();
    }
  });
}
