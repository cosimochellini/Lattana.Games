import { player } from "./sanity";

export type information = {
  profile: player;
  rank: {
    win: number;
    lost: number;
    ratio: number;
  };
};

export enum orderby {
  win = "win",
  ratio = "ratio",
  lost = "lost",
}
export enum secretHitlerOrderBy {
  hitlerMatches = "hitlerMatches",
  liberalMatches = "liberalMatches",
  fascistMatches = "fascistMatches",
  totalMatches = "totalMatches",
}

export enum orderbyDirection {
  asc = "asc",
  desc = "desc",
}
