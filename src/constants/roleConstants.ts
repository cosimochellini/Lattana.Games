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

export const iconRoles = {
  [role.admin]: "fad fa-jedi",
  [role.editor]: "fas fa-typewriter",
  [role.nosy]: "fas fa-eye-evil",
};
