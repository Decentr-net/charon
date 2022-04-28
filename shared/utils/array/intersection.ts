export const arrayIntersection = <T = unknown>(array1: T[], array2: T[]) => {
  return array1.filter((value) => array2.includes(value));
};
