import { byNumber, byValue } from "sort-es";
import { IMatch, IMatchPlayer, player, Dictionary } from "@/types";

export type Mate = {
  win: number;
  lose: number;
  ratio: number;
  nickname: string;
  player: player;
};

export type ReadableStats<T> = {
  raw: number;
  percentage: number | null;
  display: string;
  rawItems: T[];
};

export abstract class BaseStats<
  TMatch extends IMatch<TMatch, TMatchPlayer>,
  TMatchPlayer extends IMatchPlayer<TMatch, TMatchPlayer>
> {
  protected _player: player;
  protected _matches: TMatchPlayer[] = [];
  protected _wonMatches: TMatchPlayer[] = [];
  protected _lostMatches: TMatchPlayer[] = [];
  protected _penaltyPoints: TMatchPlayer[] = [];
  protected _bestMates: Mate[] = [];
  protected _worstOpponents: Mate[] = [];

  constructor(matches: TMatchPlayer[], player: player) {
    this._matches = matches;
    this._player = player;
  }

  protected loadBaseStats() {
    for (const match of this._matches)
      if (match.win) this._wonMatches.push(match);
      else this._lostMatches.push(match);
  }

  protected loadPenalties() {
    for (const match of this._matches)
      if (match.penaltyPoint) this._penaltyPoints.push(match);
  }

  protected loadBestMates() {
    const mates: Dictionary<Mate> = {};
    const plays = this._matches.flatMap((m) =>
      m.match.players.filter(
        (p) => m.player._id !== p.player._id && m.win === p.win
      )
    );

    for (const player of plays) {
      const stat = mates[player.player.nickname] ?? {
        win: 0,
        lose: 0,
        player: player.player,
      };

      player.win ? stat.win++ : stat.lose++;

      mates[player.player.nickname] = stat;
    }

    for (const nickname in mates) {
      const { win, lose, player } = mates[nickname];
      const ratio = win / (win + lose);

      this._bestMates.push({ win, ratio, lose, nickname, player });
    }

    return this._bestMates.sort(byValue("ratio", byNumber({ desc: true })));
  }

  protected loadWorstOpponents() {
    const mates: Dictionary<Mate> = {};
    const plays = this._matches.flatMap((m) =>
      m.match.players.filter(
        (p) => m.player._id !== p.player._id && m.win !== p.win
      )
    );

    for (const player of plays) {
      const stat = mates[player.player.nickname] ?? {
        win: 0,
        lose: 0,
        player: player.player,
      };

      player.win ? stat.win++ : stat.lose++;

      mates[player.player.nickname] = stat;
    }

    for (const nickname in mates) {
      const { win, lose, player } = mates[nickname];
      const ratio = win / (win + lose);

      this._worstOpponents.push({ win, ratio, lose, nickname, player });
    }

    return this._worstOpponents.sort(
      byValue("ratio", byNumber({ desc: true }))
    );
  }

  public get matches() {
    return BaseStats.BindStats("totalMatches", this._matches, null);
  }

  public get wonMatches() {
    if (!this._lostMatches.length && !this._wonMatches.length)
      this.loadBaseStats();

    return BaseStats.BindStats("totalWin", this._wonMatches, this._matches);
  }

  public get lostMatches() {
    if (!this._lostMatches.length && !this._wonMatches.length)
      this.loadBaseStats();

    return BaseStats.BindStats("totalLose", this._lostMatches, this._matches);
  }

  public get penaltyPoints() {
    if (!this._penaltyPoints.length) this.loadPenalties();

    return BaseStats.BindStats(
      "penaltyPoints",
      this._penaltyPoints,
      this._matches
    );
  }

  public get bestMates() {
    if (!this._bestMates.length) this.loadBestMates();

    return this._bestMates;
  }

  public get worstOpponents() {
    if (!this._worstOpponents.length) this.loadWorstOpponents();

    return this._worstOpponents;
  }

  public static Ratio<T>(first: T[], second: T[]) {
    return first.length / second.length || 0;
  }

  public GetReadableStats() {
    return [this.wonMatches, this.penaltyPoints];
  }

  public static BindStats<T>(
    display: string,
    subset: T[],
    set: unknown[] | null = null
  ): ReadableStats<T> {
    const ret: ReadableStats<T> = {
      display,
      raw: subset.length,
      percentage: null,
      rawItems: subset,
    };

    if (set) ret.percentage = BaseStats.Ratio(subset, set);

    return ret;
  }
}
