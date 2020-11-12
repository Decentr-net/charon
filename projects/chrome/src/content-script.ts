import { createToolbarIframe } from './content/iframe';

const iframe = createToolbarIframe();
console.log(window.parent);
document.documentElement.append(iframe);
