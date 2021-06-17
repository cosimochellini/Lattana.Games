import { BaseStats } from "./baseStats";
import { secretHitlerRole } from "@/constants";
import { secretHitlerMatch, secretHitlerMatchPlayer } from "@/types";

/**
 * SecretHitler statistics class
 */
export class SecretHitlerStats extends BaseStats<
  secretHitlerMatch,
  secretHitlerMatchPlayer
> {
  private _liberalMatches: SecretHitlerStats | null = null;
  private _fascistMatches: SecretHitlerStats | null = null;
  private _hitlerMatches: SecretHitlerStats | null = null;

  public get liberalMatches() {
    if (!this.areRolesMatchesLoaded) this.loadRolesMatches();

    return BaseStats.BindStats(
      "liberals",
      this._liberalMatches!._matches,
      this._matches
    );
  }

  public get liberalWinMatches() {
    if (!this.areRolesMatchesLoaded) this.loadRolesMatches();

    return BaseStats.BindStats(
      "liberalWins",
      this._liberalMatches!.wonMatches.rawItems,
      this._liberalMatches!._matches
    );
  }

  public get fascistMatches() {
    if (!this.areRolesMatchesLoaded) this.loadRolesMatches();

    return BaseStats.BindStats(
      "fascists",
      this._fascistMatches!._matches,
      this._matches
    );
  }
  public get fascistWinMatches() {
    if (!this.areRolesMatchesLoaded) this.loadRolesMatches();

    return BaseStats.BindStats(
      "fascistWins",
      this._fascistMatches!.wonMatches.rawItems,
      this._fascistMatches!._matches
    );
  }

  public get hitlerMatches() {
    if (!this.areRolesMatchesLoaded) this.loadRolesMatches();

    return BaseStats.BindStats(
      "hitlers",
      this._hitlerMatches!._matches,
      this._matches
    );
  }

  public get hitlerWinMatches() {
    if (!this.areRolesMatchesLoaded) this.loadRolesMatches();

    return BaseStats.BindStats(
      "hitlerWins",
      this._hitlerMatches!.wonMatches.rawItems,
      this._hitlerMatches!._matches
    );
  }

  private loadRolesMatches() {
    const liberals = [] as secretHitlerMatchPlayer[];
    const fascists = [] as secretHitlerMatchPlayer[];
    const hitlers = [] as secretHitlerMatchPlayer[];

    for (const match of this._matches)
      if (match.role === secretHitlerRole.liberal) liberals.push(match);
      else if (match.role === secretHitlerRole.fascist) fascists.push(match);
      else hitlers.push(match);

    this._liberalMatches = new SecretHitlerStats(liberals, this._player);
    this._fascistMatches = new SecretHitlerStats(fascists, this._player);
    this._hitlerMatches = new SecretHitlerStats(hitlers, this._player);
  }

  private get areRolesMatchesLoaded(): boolean {
    return !!(
      this._liberalMatches ??
      this._fascistMatches ??
      this._hitlerMatches
    );
  }

  public GetReadableStats() {
    return super
      .GetReadableStats()
      .concat([
        this.liberalMatches,
        this.liberalWinMatches,
        this.fascistMatches,
        this.fascistWinMatches,
        this.hitlerMatches,
        this.hitlerWinMatches,
      ]);
  }
}
