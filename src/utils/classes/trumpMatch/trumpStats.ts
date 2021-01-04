import { trumpMatchPlayer } from "@/types/sanity";

export class TrumpStats {
  private _matches: trumpMatchPlayer[] = [];
  private _wonMatches: trumpMatchPlayer[] = [];
  private _lostMatches: trumpMatchPlayer[] = [];

  constructor(matches: trumpMatchPlayer[]) {
    this._matches = matches;
  }

  private loadWinLost() {
    for (const match of this.matches) {
      if (match.win) this._wonMatches.push(match);
      else this._lostMatches.push(match);
    }
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

  public get ratio() {
    return this.wonMatches.length / this.matches.length;
  }
}
