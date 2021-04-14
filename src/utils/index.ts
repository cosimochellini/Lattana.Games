import { PackageJson } from "type-fest";

export const uuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

export const differenceInDays = (d1: Date, d2: Date = new Date()) => {
  const t2 = d2.getTime();
  const t1 = d1.getTime();

  return (t2 - t1) / (24 * 3600 * 1000);
};

export const mergeObjects = (initial: any, final: any) => {
  for (const key in initial) initial[key] = final[key];
};

export const range = (r: [number, number], value: number): boolean => {
  const [start, end] = r;
  return value >= start && value <= end;
};

export const settings = require("@/../package.json") as PackageJson;

export const deepClone = <T>(obj: T) => JSON.parse(JSON.stringify(obj)) as T;
