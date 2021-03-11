export const mergeObjects = (initial: any, final: any) => {
  for (const key in initial) initial[key] = final[key];
};
