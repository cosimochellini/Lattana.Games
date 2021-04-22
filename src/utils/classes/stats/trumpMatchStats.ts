import { BaseStats, ReadableStats } from "./baseStats";
import { trumpMatch, trumpMatchPlayer } from "@/types";

/**
 * TrumpMatch statistics class
 */
export class TrumpStats extends BaseStats<trumpMatch, trumpMatchPlayer> {
  private _fullScoreMatches: TrumpStats | null = null;
  private _callingStats: TrumpStats | null = null;

  public get callingStats() {
    if (!this._callingStats) this.loadCallingStats();

    return BaseStats.BindStats(
      "callingMatches",
      this._callingStats!._matches,
      this._matches
    );
  }

  public get callingWinStats() {
    if (!this._callingStats) this.loadCallingStats();

    return BaseStats.BindStats(
      "callingMatchesWins",
      this._callingStats!.wonMatches.rawItems,
      this._callingStats!._matches
    );
  }

  public get fullScoreMatches() {
    if (!this._fullScoreMatches) this.loadFullScore();

    return BaseStats.BindStats(
      "120Matches",
      this._fullScoreMatches!._matches,
      this._matches
    );
  }

  public get fullScoreWinMatches() {
    if (!this._fullScoreMatches) this.loadFullScore();

    return BaseStats.BindStats(
      "120MatchesWin",
      this._fullScoreMatches!.wonMatches.rawItems,
      this._fullScoreMatches!._matches
    );
  }

  public get fullScoreCallingMatches() {
    if (!this._callingStats) this.loadCallingStats();

    this._callingStats!.fullScoreMatches; //for load the _fullScoreMatches

    return BaseStats.BindStats(
      "called120Matches",
      this._callingStats!._fullScoreMatches!._matches,
      this._callingStats!._matches
    );
  }

  public get fullScoreCallingWinMatches() {
    if (!this._callingStats) this.loadCallingStats();

    this._callingStats!.fullScoreMatches; //for load the _fullScoreMatches

    return BaseStats.BindStats(
      "called120MatchesWin",
      this._callingStats!._fullScoreMatches!.wonMatches.rawItems,
      this._callingStats!._fullScoreMatches!._matches
    );
  }

  public get mediaScore(): ReadableStats<trumpMatchPlayer> {
    const mediaScore =
      this._matches
        .map(({ match }) => match.startingScore)
        .reduce((t, c) => t + c, 0) / this._matches.length || 0;

    return {
      raw: mediaScore,
      display: "mediaCallingScore",
      rawItems: this._matches,
      percentage: null,
    };
  }

  private loadCallingStats() {
    const callingMatches = [] as trumpMatchPlayer[];
    for (const match of this._matches) {
      const ref = (match.match.callingPlayer as any)._ref;
      if (ref === this._player._id) callingMatches.push(match);
    }

    this._callingStats = new TrumpStats(callingMatches, this._player);
  }

  private loadFullScore() {
    const fullScoreMatches = [] as trumpMatchPlayer[];

    for (const match of this._matches)
      if (match.match.startingScore === 120) fullScoreMatches.push(match);

    this._fullScoreMatches = new TrumpStats(fullScoreMatches, this._player);
  }

  public GetReadableStats() {
    return super
      .GetReadableStats()
      .concat([
        this.callingStats,
        this.callingWinStats,
        this.fullScoreMatches,
        this.fullScoreWinMatches,
        this.fullScoreCallingMatches,
        this.fullScoreCallingWinMatches,
        this.mediaScore,
      ]);
  }
}
