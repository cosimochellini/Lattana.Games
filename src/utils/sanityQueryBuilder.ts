import { nanoid } from "nanoid";

export const contains = (param: string) => `*${param}*`;

export const startWith = (param: string) => `*${param}`;

export const endWith = (param: string) => `${param}*`;

export const empty = (array: string[]) => (array.length ? array : [""]);

export const reference = ({ _id }: { _id: string }) => ({ _ref: _id });

export const referenceWithKey = ({ _id }: { _id: string }) => ({
  _ref: _id,
  _key: nanoid(),
});
