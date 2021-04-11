import { orderby } from "@/types/ranking";
import { IMatch, IMatchPlayer, player } from "@/types";

export class RankingList<
  TMatch extends IMatch<TMatch, TMatchPlayer>,
  TMatchPlayer extends IMatchPlayer<TMatch, TMatchPlayer>,
  TRank extends BaseRank<TMatch, TMatchPlayer>
> {
  private _matches: TMatch[];
  private _ctor: (items: TMatchPlayer[], total: TMatch[]) => TRank;
  private _uniquePlayers: string[] = [];

  private _groupedRanks: TRank[] = [];

  constructor(
    matches: TMatch[],
    ctor: (items: TMatchPlayer[], total: TMatch[]) => TRank
  ) {
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

      this._groupedRanks.push(this._ctor(playerMatches, this._matches));
    }
  }

  public static default<
    TMatch extends IMatch<TMatch, TMatchPlayer>,
    TMatchPlayer extends IMatchPlayer<TMatch, TMatchPlayer>,
    TRank extends BaseRank<TMatch, TMatchPlayer>
  >(fac: (items: TMatchPlayer[], total: TMatch[]) => TRank) {
    return new RankingList<TMatch, TMatchPlayer, TRank>([] as TMatch[], fac);
  }
}

export type Rankable = {
  raw: number;
  percentage: number;
  higherBetter: boolean;
};

export abstract class BaseRank<
  TMatch extends IMatch<TMatch, TMatchPlayer>,
  TMatchPlayer extends IMatchPlayer<TMatch, TMatchPlayer>
> {
  protected _playerMatches: TMatchPlayer[];

  protected _allMatches: TMatch[];

  protected _cache: Map<string, TMatchPlayer[]> = new Map();

  public profile: player;

  constructor(playerMatches: TMatchPlayer[], allMatches: TMatch[]) {
    this._playerMatches = playerMatches;
    this.profile = playerMatches[0].player;
    this._allMatches = allMatches;
  }

  protected get wins() {
    return this.safeCache(orderby.win, () =>
      this._playerMatches.filter(({ win }) => win)
    );
  }

  public get win() {
    return this.rankable(this.wins, this._playerMatches);
  }

  public get lost(): Rankable {
    const raw = this._playerMatches.length - this.wins.length;
    return {
      raw,
      percentage: raw / this._playerMatches.length,
      higherBetter: false,
    };
  }

  public get totalPlayerMatches() {
    return this.rankable(this._playerMatches, this._allMatches);
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

  protected rankable(
    filtered: unknown[],
    total: unknown[],
    higherBetter: boolean = true
  ): Rankable {
    return {
      raw: filtered.length,
      percentage: filtered.length / total.length || 0,
      higherBetter,
    };
  }
}
