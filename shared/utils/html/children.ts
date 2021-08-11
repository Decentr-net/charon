export const getAllChildNodes = (element: Node): Node[] => {
  return Array.from(element.childNodes).reduce((acc, childNode) => {
    return [...acc, childNode, ...getAllChildNodes(childNode)];
  }, []);
};

export const getLowestLevelChildNodes = (element: Node): Node[] => {
  return getAllChildNodes(element)
    .filter((child) => !child.childNodes.length);
};
