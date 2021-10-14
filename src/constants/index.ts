import { Dictionary } from "@/types";

export enum role {
  nosy = "nosy",
  admin = "admin",
  editor = "editor",
}

export enum sanityTypes {
  player = "player",
  trumpMatch = "trumpMatch",
  trumpMatchPlayer = "trumpMatchPlayer",
  secretHitlerMatch = "secretHitlerMatch",
  secretHitlerMatchPlayer = "secretHitlerMatchPlayer",
}

export enum secretHitlerRole {
  fascist = "fascist",
  hitler = "hitler",
  liberal = "liberal",
}

export const iconRoles: Dictionary<string, role> = {
  [role.admin]: "fad fa-jedi",
  [role.editor]: "fas fa-typewriter",
  [role.nosy]: "fas fa-eye-evil",
};

export enum games {
  trump = "trump",
  secretHitler = "secretHitler",
}

export const allAvailableGames = [games.trump, games.secretHitler];
