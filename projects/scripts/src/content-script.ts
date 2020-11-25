import { isTopWindow } from './helpers/window';
import { createToolbarIframe } from './content/iframe';

const iframe = createToolbarIframe();

if (isTopWindow(window.self)) {
  document.documentElement.append(iframe);
}
