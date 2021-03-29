import { BaseRank } from "./baseRank";
import { trumpOrderBy } from "@/types/ranking";
import { trumpMatch, trumpMatchPlayer } from "@/types";

export class trumpRank extends BaseRank<trumpMatch, trumpMatchPlayer> {
  public get calculatedScore() {
    return this.wins.reduce((value, match) => {
      return match.match.startingScore === 120 ? value + 2 : value + 1;
    }, 0);
  }

  public get calledMatches() {
    return this.safeCache(trumpOrderBy.calledMatches, () =>
      this._playerMatches.filter(
        (match) => match.match.callingPlayer._id === this.profile._id
      )
    ).length;
  }

  public get calledMatches120() {
    return this.safeCache(trumpOrderBy.calledMatches120, () =>
      this._playerMatches.filter((match) => match.match.startingScore === 120)
    ).length;
  }

  static create(items: trumpMatchPlayer[]) {
    return new trumpRank(items);
  }
}
