import { player } from "@/types/sanity";
import { roleConstants, sanityTypes } from "@/constants/roleConstants";

import {
  QueryBuilder,
  ConditionBuilder,
  PaginationBuilder,
} from "@/utils/sanityQueryBuilder";

const LS_PLAYER_KEY = "LG_stored_user";

const login = async (name: string, pin: string) => {
  const player = await new QueryBuilder(sanityTypes.player)
    .select(
      `_id, name, surname, nickname, email, profileImage, 'roles': roles[]->role->name`
    )
    .where(
      new ConditionBuilder(
        "(nickname == $name && pin == $pin) || (email == $name && pin == $pin)"
      ).params({ name: name.toLowerCase(), pin: Number.parseInt(pin) })
    )
    .get(new PaginationBuilder().first())
    .fetch<player | null>(false);

  setPlayer(player);
};

const isAuthorized = (
  roles: roleConstants[] = [],
  player: player | null = getPlayer()
): boolean => {
  if (player === null) return false;

  if (roles.length === 0) return isLogged(player);

  if (player.roles.includes(roleConstants.Admin)) return true;

  for (const role of player.roles) {
    if (roles.includes(role)) return true;
  }

  return false;
};

const isLogged = (player: player | null = null) => {
  if (player === null) {
    player = getPlayer();
  }

  return player !== null;
};

const setPlayer = (player: player | null) =>
  localStorage.setItem(LS_PLAYER_KEY, JSON.stringify(player));

const getPlayer = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_PLAYER_KEY) ?? "") as player;
  } catch (error) {
    setPlayer(null);
    return null;
  }
};

export { login, isAuthorized, getPlayer, setPlayer };
