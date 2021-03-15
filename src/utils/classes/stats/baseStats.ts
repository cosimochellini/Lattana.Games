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
  protected _bestMates: Mate[] = [];
  protected _worstOpponents: Mate[] = [];

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

  protected loadBestMates() {
    const mates: Dictionary<Mate> = {};
    const plays = this.matches.flatMap((m) =>
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
    const plays = this.matches.flatMap((m) =>
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
    console.log(this);
    return this._worstOpponents.sort(
      byValue("ratio", byNumber({ desc: true }))
    );
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
}
