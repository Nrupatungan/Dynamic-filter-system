/* eslint-disable @typescript-eslint/no-explicit-any */
export const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};
