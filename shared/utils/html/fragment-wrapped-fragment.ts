export const createFragmentWrappedContainer = (): HTMLDivElement => {
  const fragment = document.createDocumentFragment();
  const container = document.createElement('div');
  fragment.appendChild(container);

  return container;
}
