import { BaseRank } from "./baseRank";
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
    return this.hitlers.length;
  }

  public get liberalMatches() {
    return this.liberals.length;
  }

  public get fascistMatches() {
    return this.fascists.length;
  }

  public get weightedAverage() {
    return (
      this.aggregateAverages(this.liberals, this.hitlers, this.fascists) * 100
    );
  }

  public static create(items: secretHitlerMatchPlayer[]) {
    return new secretHitlerRank(items);
  }
}
