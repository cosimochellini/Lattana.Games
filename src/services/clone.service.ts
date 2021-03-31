export const clone = {
  deepClone<T>(obj: T) {
    return JSON.parse(JSON.stringify(obj)) as T;
  },
};
