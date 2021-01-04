import { Dictionary } from "@/types/base";
import { byNumber, byValue } from "sort-es";
import { player, trumpMatchPlayer } from "@/types/sanity";

export class TrumpStats {
  private _player: player;
  private _matches: trumpMatchPlayer[] = [];
  private _wonMatches: trumpMatchPlayer[] = [];
  private _lostMatches: trumpMatchPlayer[] = [];
  private _penaltyPoints: trumpMatchPlayer[] = [];
  private _callingMatches: trumpMatchPlayer[] = [];

  constructor(matches: trumpMatchPlayer[], player: player) {
    this._matches = matches;
    this._player = player;
  }

  private loadWinLost() {
    for (const match of this.matches)
      if (match.win) this._wonMatches.push(match);
      else this._lostMatches.push(match);
  }

  loadMates() {
    const mates: Dictionary<{ win: number; lose: number }> = {};
    const plays = this.matches.flatMap(
      (m) =>
        m.trumpMatch.players?.filter(
          (p) => m.player._id !== p.player._id && m.win === p.win
        ) ?? []
    );

    for (const player of plays) {
      const stat = mates[player.player.nickname] ?? { win: 0, lose: 0 };
      if (player.win) stat.win = stat.win + 1;
      else stat.lose = stat.lose + 1;

      mates[player.player.nickname] = stat;
    }

    const results: {
      win: number;
      lose: number;
      ratio: number;
      nickname: string;
    }[] = [];

    for (const nickname in mates) {
      const { win, lose } = mates[nickname];
      results.push({ win, lose, ratio: win / (win + lose), nickname });
    }

    return results.sort(byValue("ratio", byNumber({ desc: true })));
  }

  public get matches() {
    return this._matches;
  }

  public get wonMatches() {
    if (!this._wonMatches.length) this.loadWinLost();

    return this._wonMatches;
  }

  public get lostMatches() {
    if (!this._lostMatches.length) this.loadWinLost();

    return this._lostMatches;
  }

  public get penaltyPoints() {
    if (!this._penaltyPoints.length)
      for (const match of this.matches)
        if (match.penaltyPoint) this._penaltyPoints.push(match);

    return this._penaltyPoints;
  }
  public get callingMatches() {
    if (!this._callingMatches.length)
      for (const match of this.matches)
        if (match.trumpMatch.callingPlayer._id === this._player._id)
          this._callingMatches.push(match);

    return this._callingMatches;
  }

  public get ratio() {
    return this.wonMatches.length / this.matches.length;
  }
}
