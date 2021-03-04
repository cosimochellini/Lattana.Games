export const differenceInDays = (d1: Date, d2: Date = new Date()) => {
  const t2 = d2.getTime();
  const t1 = d1.getTime();

  return (t2 - t1) / (24 * 3600 * 1000);
};
