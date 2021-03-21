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

export enum orderbyDirection {
  asc = "asc",
  desc = "desc",
}
