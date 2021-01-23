import { BaseStats } from "./baseStats";
import { secretHitlerRole } from "@/constants/roleConstants";
import { secretHitlerMatch, secretHitlerMatchPlayer } from "@/types/sanity";

/**
 * SecretHitler statistics class
 */
export class SecretHitlerStats extends BaseStats<
  secretHitlerMatch,
  secretHitlerMatchPlayer
> {
  private _liberalMatches: secretHitlerMatchPlayer[] = [];
  private _fascistMatches: secretHitlerMatchPlayer[] = [];
  private _hitlerMatches: secretHitlerMatchPlayer[] = [];

  public get liberalMatches() {
    if (!this.areRolesMatchesLoaded) this.loadRolesMatches();

    return this._liberalMatches;
  }

  public get fascistMatches() {
    if (!this.areRolesMatchesLoaded) this.loadRolesMatches();

    return this._fascistMatches;
  }

  public get hitlerMatches() {
    if (!this.areRolesMatchesLoaded) this.loadRolesMatches();

    return this._hitlerMatches;
  }

  private loadRolesMatches() {
    for (const match of this.matches) {
      if (match.role === secretHitlerRole.liberal)
        this._liberalMatches.push(match);
      else if (match.role === secretHitlerRole.fascist)
        this._fascistMatches.push(match);
      else this._hitlerMatches.push(match);
    }
  }

  private get areRolesMatchesLoaded() {
    return (
      this._liberalMatches.length ||
      this._fascistMatches.length ||
      this._hitlerMatches.length
    );
  }
}
