import { orderby } from "@/types/ranking";
import { IMatch, IMatchPlayer, player } from "@/types";

export class RankingList<
  TMatch extends IMatch<TMatch, TMatchPlayer>,
  TMatchPlayer extends IMatchPlayer<TMatch, TMatchPlayer>,
  TRank extends BaseRank<TMatch, TMatchPlayer>
> {
  private _matches: TMatch[];
  private _ctor: (items: TMatchPlayer[]) => TRank;
  private _uniquePlayers: string[] = [];

  private _groupedRanks: TRank[] = [];

  constructor(matches: TMatch[], ctor: (items: TMatchPlayer[]) => TRank) {
    this._matches = matches;
    this._ctor = ctor;
  }

  public get uniquePlayers(): string[] {
    if (!this._uniquePlayers.length) {
      this._uniquePlayers = Array.from(
        new Set(
          this._matches.flatMap((x) => x.players.map((p) => p.player.nickname))
        )
      );
    }
    return this._uniquePlayers;
  }

  public toList(): TRank[] {
    if (!this._groupedRanks.length) {
      this.loadGroupedRanks();
    }
    return this._groupedRanks;
  }

  private loadGroupedRanks() {
    for (const nickname of this.uniquePlayers) {
      const playerMatches = this._matches
        .map((match) => {
          return match.players.find((p) => p.player.nickname === nickname);
        })
        .filter(Boolean) as TMatchPlayer[];

      this._groupedRanks.push(this._ctor(playerMatches));
    }
  }

  public static default<
    TMatch extends IMatch<TMatch, TMatchPlayer>,
    TMatchPlayer extends IMatchPlayer<TMatch, TMatchPlayer>,
    TRank extends BaseRank<TMatch, TMatchPlayer>
  >(fac: (items: TMatchPlayer[]) => TRank) {
    return new RankingList<TMatch, TMatchPlayer, TRank>([] as TMatch[], fac);
  }
}

export abstract class BaseRank<
  TMatch extends IMatch<TMatch, TMatchPlayer>,
  TMatchPlayer extends IMatchPlayer<TMatch, TMatchPlayer>
> {
  protected _playerMatches: TMatchPlayer[];

  protected _cache: Map<string, TMatchPlayer[]> = new Map();

  public profile: player;

  constructor(playerMatches: TMatchPlayer[]) {
    this._playerMatches = playerMatches;
    this.profile = playerMatches[0].player;
  }

  protected get wins() {
    return this.safeCache(orderby.win, () =>
      this._playerMatches.filter(({ win }) => win)
    );
  }

  public get win(): number {
    return this.wins.length;
  }

  public get lost(): number {
    return this._playerMatches.length - this.win;
  }

  public get totalMatches(): number {
    return this._playerMatches.length;
  }

  public get ratio(): number {
    return this.win / this._playerMatches.length;
  }

  protected safeCache(key: string, f: () => TMatchPlayer[]): TMatchPlayer[] {
    if (!this._cache.has(key)) this._cache.set(key, f());

    return this._cache.get(key) as TMatchPlayer[];
  }

  protected aggregateAverages(...filteredMatches: TMatchPlayer[][]) {
    return (
      filteredMatches
        .map((matches) => {
          const wins = matches.filter((x) => x.win).length;

          return wins ? wins / matches.length || 0 : 0;
        })
        .reduce((initial, current) => initial + (current || 0), 0) /
      filteredMatches.length
    );
  }
}
