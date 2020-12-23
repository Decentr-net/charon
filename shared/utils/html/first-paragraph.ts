export const getFirstParagraph = (html: string): string => {
  const source = createFragmentWrappedContainer();
  source.innerHTML = html;

  const target = createFragmentWrappedContainer();

  let nodeToCheck = source.firstChild;
  while (nodeToCheck) {
    if (nodeToCheck.nodeType === 3) {
      target.appendChild(nodeToCheck.cloneNode(true));
    } else {
      const nodeToCheckAsElement = nodeToCheck as Element;

      if (nodeToCheckAsElement.tagName === 'BR') {
        break;
      }

      const element = nodeToCheck.cloneNode() as Element;
      element.innerHTML = getFirstParagraph(nodeToCheckAsElement.innerHTML);
      target.appendChild(element);

      if (element.innerHTML < nodeToCheckAsElement.innerHTML) {
        break;
      }
    }

    nodeToCheck = nodeToCheck.nextSibling;
  }

  return target.innerHTML;
}

const createFragmentWrappedContainer = (): HTMLDivElement => {
  const fragment = document.createDocumentFragment();
  const container = document.createElement('div');
  fragment.appendChild(container);

  return container;
}
