import { trumpOrderBy } from "@/types/ranking";
import { BaseRank, Rankable } from "./baseRank";
import { trumpMatch, trumpMatchPlayer } from "@/types";

export class trumpRank extends BaseRank<trumpMatch, trumpMatchPlayer> {
  public get calculatedScore(): Rankable {
    const actualScore = this.wins.reduce((value, match) => {
      return match.match.startingScore === 120 ? value + 2 : value + 1;
    }, 0);
    const maxScore = this._playerMatches.length;

    return {
      raw: actualScore,
      percentage: actualScore / maxScore,
      higherBetter: true,
    };
  }

  protected get called() {
    return this.safeCache(trumpOrderBy.calledMatches, () =>
      this._playerMatches.filter(
        (match) => match.match.callingPlayer._id === this.profile._id
      )
    );
  }

  protected get called120() {
    return this.safeCache(trumpOrderBy.calledMatches120, () =>
      this.called.filter((match) => match.match.startingScore === 120)
    );
  }

  public get calledMatches() {
    return this.rankable(this.called, this._playerMatches);
  }

  public get calledMatches120() {
    return this.rankable(this.called120, this.called);
  }

  static create(items: trumpMatchPlayer[], total: trumpMatch[]) {
    return new trumpRank(items, total);
  }
}
