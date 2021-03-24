import { player } from "@/types/sanity";
import { groq } from "@/utils/GroqQueryBuilder";
import { notificationService } from "./notificationService";
import { reactiveStorage } from "./reactiveStorage.service";
import { roleConstants, sanityTypes } from "@/constants/roleConstants";

const LS_PLAYER_KEY = "LG_STORED_USER";

export const currentPlayer = reactiveStorage<player | null>(
  LS_PLAYER_KEY,
  null
);

const loginQuery = new groq.QueryBuilder(sanityTypes.player)
  .select(`..., 'roles': roles[]->role->name`)
  .get(new groq.PaginationBuilder().first())
  .freeze();

export const login = (name: string, pin: string) =>
  loginQuery
    .where(
      new groq.ConditionBuilder(
        "(nickname == $name && pin == $pin) || (email == $name && pin == $pin)"
      ).params({ name: name.toLowerCase(), pin: Number.parseInt(pin) })
    )
    .fetch<player | null>()
    .then((p) => (currentPlayer.value = p))
    .catch(notificationService.danger);

export const isAuthorized = (
  roles: roleConstants[] = [],
  player: player | null = currentPlayer.value
): boolean => {
  try {
    if (player === null) return false;

    if (!roles.length) return isLogged(player);

    if (player.roles.includes(roleConstants.Admin)) return true;

    return player.roles.some((r) => roles.includes(r));
  } catch (error) {
    return false;
  }
};

const isLogged = (player: player | null = currentPlayer.value) =>
  player !== null;
