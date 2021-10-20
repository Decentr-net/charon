export const getNodeRect = (node: Node): DOMRect => {
  const range = document.createRange();
  range.selectNode(node);
  return range.getBoundingClientRect();
};
