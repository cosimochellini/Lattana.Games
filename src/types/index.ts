import { sanityTypes } from "@/constants";
import { secretHitlerRole } from "@/constants";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface IMatch<
  TMatch extends IMatch<TMatch, TPlayer>,
  TPlayer extends IMatchPlayer<TMatch, TPlayer>
> extends IMatchBase {
  players: TPlayer[];
}

export interface IMatchBase extends sanityEntity {
  matchDate: Date;
  players: IMatchPlayerBase[];
  createdBy: player;
  updatedBy: player | null;
}

export interface IMatchPlayer<
  TMatch extends IMatch<TMatch, TMatchPlayer>,
  TMatchPlayer extends IMatchPlayer<TMatch, TMatchPlayer>
> extends IMatchPlayerBase {
  match: TMatch;
}

export interface IMatchPlayerBase extends sanityEntity {
  player: player;
  win: boolean;
  penaltyPoint: boolean;
}

export interface player extends sanityEntity {
  name: string;
  surname: string;
  nickname: string;
  email: string;
  pin: number;
  birthday: string;
  roles: string | null;
  profileImage: SanityImageSource;
}

export interface trumpMatchPlayer
  extends IMatchPlayer<trumpMatch, trumpMatchPlayer> {}

export interface trumpMatch extends IMatch<trumpMatch, trumpMatchPlayer> {
  startingScore: number;
  finalScore: number;
  callingPlayer: player;
}

export interface secretHitlerMatchPlayer
  extends IMatchPlayer<secretHitlerMatch, secretHitlerMatchPlayer> {
  role: secretHitlerRole;
}

export interface secretHitlerMatch
  extends IMatch<secretHitlerMatch, secretHitlerMatchPlayer> {
  winningRole: secretHitlerRole;
}

//-------------------CUSTOM--------------------

export type Dictionary<T, TKey extends string = string> = Record<TKey, T>;

export type QueryableParam =
  | string
  | null
  | undefined
  | Date
  | number
  | boolean
  | Array<QueryableParam>;

export interface sanityEntity {
  _id: string;
  _type: sanityTypes;
  _createdAt: Date;
  _updatedAt: Date;
}

export interface sanityReference<T> {
  _ref: string;
}

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

export type sanityPostProp<T> = T extends null
  ? any
  : T extends QueryableParam
  ? T
  : T extends Array<any>
  ? sanityReference<T>[]
  : sanityReference<T>;

export type sanityDocument<T> = Omit<{
  [key in keyof T]: sanityPostProp<T[key]>;
}, "_createdAt" | "_updatedAt">;

export type datable = string | Date | null | number | undefined;
