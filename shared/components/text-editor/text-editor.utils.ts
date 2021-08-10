const getAllChildNodes = (element: Node): Node[] => {
  return Array.from(element.childNodes).reduce((acc, childNode) => {
    return [...acc, childNode, ...getAllChildNodes(childNode)];
  }, []);
};

const isImageNode = (node: Node): boolean => (node as Element)?.tagName?.toLowerCase() === 'img';

const isNodeActive = (node: Node): boolean => {
  const activeElement = document.getSelection()?.getRangeAt(0)?.endContainer;
  console.log(activeElement);
  return node === activeElement || activeElement?.contains(node);
};

export const removeExtraBlankLines = (element: Element, ignoreSelection = false): void => {
  let firstChild = element.firstChild;
  while (firstChild && !firstChild.textContent) {
    firstChild.remove();
    firstChild = element.firstChild;
  }

  const childrenToCheck = getAllChildNodes(element)
    .filter((child) => !child.childNodes.length);

  childrenToCheck
    .filter((node) => ignoreSelection || !isNodeActive(node))
    .forEach((node) => node.textContent = node.textContent.trim());

  for (let i = childrenToCheck.length - 1; i > 0; i--) {
    const node = childrenToCheck[i];

    if (!ignoreSelection && isNodeActive(node)) {
      continue;
    }

    if (
      (
        !childrenToCheck[i - 1].textContent
        && !node.textContent
        && !isImageNode(node)
      )
      ||
      (
        !node.textContent
        && isImageNode(childrenToCheck[i + 1])
      )
    ) {
      const parent = (node as Element).parentElement;
      if (parent !== element && parent.children.length === 1) {
        parent.remove();
      } else {
        (node as Element).remove();
      }

      childrenToCheck.splice(i, 1);
    }
  }
};
