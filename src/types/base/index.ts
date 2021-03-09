import { sanityTypes } from "@/constants/roleConstants";

export interface Dictionary<T> {
  [key: string]: T;
}
export type QueryableParam =
  | string
  | null
  | Date
  | number
  | boolean
  | Array<QueryableParam>;

export interface sanityEntity {
  _id: string;
  _type: sanityTypes;
}

export interface sanityReference<T> {
  _ref: string;
}

export type sanityPostProp<T> = T extends null
  ? any
  : T extends QueryableParam
  ? T
  : T extends Array<any>
  ? sanityReference<T>[]
  : sanityReference<T>;

export type sanityDocument<T> = {
  [key in keyof T]: sanityPostProp<T[key]>;
};

export type datable = string | Date | null | number | undefined;
