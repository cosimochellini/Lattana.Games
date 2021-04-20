import { BaseStats } from "./baseStats";
import { trumpMatch, trumpMatchPlayer } from "@/types";

/**
 * TrumpMatch statistics class
 */
export class TrumpStats extends BaseStats<trumpMatch, trumpMatchPlayer> {
  private _callingMatches: trumpMatchPlayer[] = [];
  private _fullScoreMatches: trumpMatchPlayer[] = [];
  private _callingStats: TrumpStats | null = null;

  public get callingStats() {
    if (!this._callingMatches.length)
      for (const match of this._matches) {
        const ref = (match.match.callingPlayer as any)._ref;
        if (ref === this._player._id) this._callingMatches.push(match);
      }

    if (!this._callingStats)
      this._callingStats = new TrumpStats(this._callingMatches, this._player);

    return this._callingStats;
  }

  public get fullScoreMatches() {
    if (!this._fullScoreMatches.length)
      for (const match of this._matches)
        if (match.match.startingScore === 120)
          this._fullScoreMatches.push(match);

    return this._fullScoreMatches;
  }

  public get callingMatchesRatio() {
    return BaseStats.Ratio(this.callingStats._matches, this._matches);
  }

  public get mediaScore() {
    return (
      this._matches
        .map((x) => x.match.startingScore)
        .reduce((t, c) => t + c, 0) / this._matches.length || 0
    );
  }
}
