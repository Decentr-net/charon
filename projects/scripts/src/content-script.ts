import { take } from 'rxjs/operators';

import { MessageBus } from '../../../shared/message-bus';
import { TOOLBAR_CLOSE } from '../../toolbar/src/app/messages';
import { isTopWindow } from './helpers/window';
import { createToolbarIframe } from './content/toolbar';

const iframe = createToolbarIframe();

if (isTopWindow(window.self)) {
  document.documentElement.append(iframe);
}

new MessageBus().onMessage(TOOLBAR_CLOSE)
  .pipe(
    take(1),
  )
  .subscribe(() => iframe.remove());
