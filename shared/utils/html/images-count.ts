import { createFragmentWrappedContainer } from './fragment-wrapped-fragment';

export const getHTMLImagesCount = (html: string) => {
  const container = createFragmentWrappedContainer();
  container.innerHTML = html;
  return container.querySelectorAll('img').length;
};
