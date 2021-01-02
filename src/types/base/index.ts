import { sanityTypes } from "@/constants/roleConstants";

export interface Dictionary<T> {
  [key: string]: T;
}
export type QueryableParam =
  | string
  | Date
  | number
  | boolean
  | Array<QueryableParam>;

export interface sanityEntity {
  _id: string;
}

export interface sanityType {
  _type: sanityTypes;
}

export interface sanityReference<T> {
  _ref: string;
}

export type sanityPostProp<T> = T extends QueryableParam
  ? T
  : T extends Array<any>
  ? (sanityReference<T> & sanityType)[]
  : sanityReference<T>;

export type sanityDocument<T> = {
  [key in keyof T]: sanityPostProp<T[key]>;
} &
  sanityType;
