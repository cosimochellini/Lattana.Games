import { roleConstants, sanityTypes } from "@/constants/roleConstants";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

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

export interface player extends sanityEntity {
  name: string;
  surname: string;
  nickname: string;
  email: string;
  roles: roleConstants[];
  profileImage: SanityImageSource;
}

export interface trumpMatchPlayer extends sanityEntity {
  player: player;
  trumpMatch: trumpMatch;
  win: boolean;
  penaltyPoint: boolean;
}

export interface trumpMatch extends sanityEntity {
  matchDate: Date;
  startingScore: number;
  finalScore: number;
  callingPlayer: player;
  players: trumpMatchPlayer[];
}
