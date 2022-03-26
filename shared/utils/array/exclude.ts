export const excludeArrayValues = <T = unknown>(target: T[], exclude: T[]) => {
  return target.filter((value) => !exclude.includes(value));
};
