export const removeExtraBlankLines = (element: HTMLElement): void => {
  let firstChild = element.firstChild;
  while (firstChild && !firstChild.textContent) {
    firstChild.remove();
    firstChild = element.firstChild;
  }

  Array.from(element.querySelectorAll('*')).forEach((child: Element) => {
    if (child.previousSibling
      && !child.previousSibling.textContent
      && !child.textContent
      && !child.querySelector('img')
      && child.tagName.toLowerCase() !== 'img'
    ) {
      child.remove();
    }
  });
};
