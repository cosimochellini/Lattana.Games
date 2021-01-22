import { Dictionary } from "@/types/base";
import { byNumber, byValue } from "sort-es";
import { IMatch, IMatchPlayer, player } from "@/types/sanity";

export type Mate = {
  win: number;
  lose: number;
  ratio: number;
  nickname: string;
  player: player;
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
  protected _mates: Mate[] = [];

  constructor(matches: TMatchPlayer[], player: player) {
    this._matches = matches;
    this._player = player;
  }

  protected loadBaseStats() {
    for (const match of this.matches)
      if (match.win) this._wonMatches.push(match);
      else this._lostMatches.push(match);
  }

  protected loadPenalties() {
    for (const match of this.matches)
      if (match.penaltyPoint) this._penaltyPoints.push(match);
  }

  protected loadMates() {
    const mates: Dictionary<Mate> = {};
    const plays = this.matches.flatMap((m) =>
      m.match.players.filter(
        (p) => m.player._id !== p.player._id && m.win === p.win
      )
    );

    for (const player of plays) {
      const stat = mates[player.player.nickname] ?? { win: 0, lose: 0, player };
      if (player.win) stat.win++;
      else stat.lose++;

      mates[player.player.nickname] = stat;
    }

    for (const nickname in mates) {
      const { win, lose, player } = mates[nickname];
      const ratio = win / (win + lose);

      this._mates.push({ win, ratio, lose, nickname, player });
    }

    return this._mates.sort(byValue("ratio", byNumber({ desc: true })));
  }

  public get matches() {
    return this._matches;
  }

  public get wonMatches() {
    if (!this._lostMatches.length && !this._wonMatches.length)
      this.loadBaseStats();

    return this._wonMatches;
  }

  public get lostMatches() {
    if (!this._lostMatches.length && !this._wonMatches.length)
      this.loadBaseStats();

    return this._lostMatches;
  }
  public get ratio() {
    return BaseStats.Ratio(this.wonMatches, this.matches);
  }

  public get penaltyPoints() {
    if (!this._penaltyPoints.length) this.loadPenalties();

    return this._penaltyPoints;
  }

  public get mates() {
    if (!this._mates.length) this.loadMates();

    return this._mates;
  }

  public static Ratio<T>(first: T[], second: T[]) {
    return first.length / second.length || 0;
  }
}
