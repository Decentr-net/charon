import { createFragmentWrappedContainer } from './fragment-wrapped-fragment';

export const getPlainText = (html: string): string => {
  const container = createFragmentWrappedContainer();

  container.innerHTML = html;

  return container.innerText;
};
