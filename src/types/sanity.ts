import { sanityEntity } from "./base";
import { roleConstants } from "@/constants/roleConstants";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

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
