import { sanityEntity } from "./base";
import { roleConstants, secretHitlerRole } from "@/constants/roleConstants";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface IMatch<
  TMatch extends IMatch<TMatch, TPlayer>,
  TPlayer extends IMatchPlayer<TMatch, TPlayer>
> extends sanityEntity {
  matchDate: Date;
  players: TPlayer[];
  createdBy: player;
  updatedBy: player | null;
}

export interface IMatchPlayer<
  TMatch extends IMatch<TMatch, TMatchPlayer>,
  TMatchPlayer extends IMatchPlayer<TMatch, TMatchPlayer>
> extends sanityEntity {
  player: player;
  win: boolean;
  penaltyPoint: boolean;
  match: TMatch;
}

export interface player extends sanityEntity {
  name: string;
  surname: string;
  nickname: string;
  email: string;
  pin: number;
  birthday: string;
  roles: roleConstants[];
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
