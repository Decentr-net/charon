import initWebpageAPIListeners from './content-script';

const injectScriptContent = (scriptContent: string): void => {
  const script = document.createElement('script');
  script.setAttribute('async', 'false');
  script.textContent = scriptContent;

  const container = document.head || document.documentElement;
  container.insertBefore(script, container.children[0]);
  container.removeChild(script);
};

export default function init(): void {
  injectScriptContent('WEBPAGE_API_CODE');

  initWebpageAPIListeners();
}
