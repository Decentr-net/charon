export const getFirstParagraph = (
  html: string,
  options?: { skipLineBreak: boolean },
): string => {
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
        if (options?.skipLineBreak || target.textContent.length > 0) {
          break;
        }
        nodeToCheck = nodeToCheck.nextSibling;
        continue;
      }

      const element = nodeToCheck.cloneNode() as Element;
      const html = getFirstParagraph(nodeToCheckAsElement.innerHTML, { skipLineBreak: true });
      if (!html.length && !target.textContent.length) {
        nodeToCheck = nodeToCheck.nextSibling;
        continue;
      }

      element.innerHTML = html;
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
