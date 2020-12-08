import { ToolbarIds } from '../content/toolbar'

let shiftedElements: Map<HTMLElement, string> = new Map();

export const updateShiftContent = (height: string = '0px') => {
  document.body.querySelectorAll('*').forEach((node: HTMLElement) => {
    const style: CSSStyleDeclaration = window.getComputedStyle(node);

    if (
      !shiftedElements.has(node)
      && ['fixed', 'absolute', 'sticky'].includes(style.position)
      && !(Object.values(ToolbarIds).includes(node.id))
      && !(style.position === 'fixed' && skipHasNoChildren(node) || style.position === 'absolute' && skipPositionedChild(node))
      && style.top !== 'auto'
    ) {
      shiftedElements.set(node, style.top);
    }
  });

  shiftedElements.forEach((nodeOffset, node) => {
    node.style.setProperty('top', `${parseInt(height) + parseInt(nodeOffset)}px`, 'important');
  });
};

const skipPositionedChild = (node: HTMLElement): boolean => {
  return (node.offsetParent && node.offsetParent.tagName !== 'BODY') || hasPositionedParent(node);
};

const hasPositionedParent = (node: HTMLElement): boolean => {
  if (node.tagName === 'BODY') return;

  const parent = node.parentNode as Element;
  const position = getComputedStyle(parent).position;

  return position !== 'static';
};

const skipHasNoChildren = (node: HTMLElement): boolean => {
  return node.children.length === 0;
};
