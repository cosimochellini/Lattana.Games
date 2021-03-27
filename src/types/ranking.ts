import { player } from ".";

export type information = {
  profile: player;
  rank: {
    win: number;
    lost: number;
    ratio: number;
    totalMatches: number;
  };
};

export enum orderby {
  win = "win",
  ratio = "ratio",
  lost = "lost",
  totalMatches = "totalMatches",
}
export enum secretHitlerOrderBy {
  hitlerMatches = "hitlerMatches",
  liberalMatches = "liberalMatches",
  fascistMatches = "fascistMatches",
}

export enum trumpOrderBy {
  calculatedScore = "calculatedScore",
  calledMatches = "calledMatches",
  calledMatches120 = "calledMatches120",
}

export enum orderbyDirection {
  asc = "asc",
  desc = "desc",
}
