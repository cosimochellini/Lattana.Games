import { BaseRank, Rankable } from "./baseRank";
import { secretHitlerOrderBy } from "@/types/ranking";
import { secretHitlerRole } from "@/constants/roleConstants";
import { secretHitlerMatch, secretHitlerMatchPlayer } from "@/types";

export class secretHitlerRank extends BaseRank<
  secretHitlerMatch,
  secretHitlerMatchPlayer
> {
  public get hitlers() {
    return this.safeCache(secretHitlerOrderBy.hitlerMatches, () =>
      this._playerMatches.filter(
        (player) => player.role === secretHitlerRole.hitler
      )
    );
  }

  public get liberals() {
    return this.safeCache(secretHitlerOrderBy.liberalMatches, () =>
      this._playerMatches.filter(
        (player) => player.role === secretHitlerRole.liberal
      )
    );
  }

  protected get fascists() {
    return this.safeCache(secretHitlerOrderBy.fascistMatches, () =>
      this._playerMatches.filter(
        (player) => player.role === secretHitlerRole.fascist
      )
    );
  }
  public get hitlerMatches() {
    return this.rankable(this.hitlers, this._playerMatches, false);
  }

  public get liberalMatches() {
    return this.rankable(this.liberals, this._playerMatches);
  }

  public get fascistMatches() {
    return this.rankable(this.fascists, this._playerMatches, false);
  }

  public get weightedAverage(): Rankable {
    return {
      raw: this._playerMatches.length,
      percentage: this.aggregateAverages(
        this.liberals,
        this.hitlers,
        this.fascists
      ),
      higherBetter: true,
    };
  }

  public static create(
    items: secretHitlerMatchPlayer[],
    totalItems: secretHitlerMatch[]
  ) {
    return new secretHitlerRank(items, totalItems);
  }
}
