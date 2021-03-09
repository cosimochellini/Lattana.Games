import { player } from "@/types/sanity";
import { groq } from "@/utils/GroqQueryBuilder";
import { notificationService } from "./notificationService";
import { roleConstants, sanityTypes } from "@/constants/roleConstants";

const LS_PLAYER_KEY = "LG_STORED_USER";
let cachedPlayer: player | null = null;

const loginQuery = new groq.QueryBuilder(sanityTypes.player)
  .select(`..., 'roles': roles[]->role->name`)
  .get(new groq.PaginationBuilder().first())
  .freeze();

const login = (name: string, pin: string) =>
  loginQuery
    .where(
      new groq.ConditionBuilder(
        "(nickname == $name && pin == $pin) || (email == $name && pin == $pin)"
      ).params({ name: name.toLowerCase(), pin: Number.parseInt(pin) })
    )
    .fetch<player | null>()
    .then((p) => setPlayer(p))
    .catch(notificationService.danger);

const isAuthorized = (
  roles: roleConstants[] = [],
  player: player | null = getPlayer()
): boolean => {
  try {
    if (player === null) return false;

    if (!roles.length) return isLogged(player);

    if (player.roles.includes(roleConstants.Admin)) return true;

    for (const role of player.roles) if (roles.includes(role)) return true;
  } catch (error) {
    return false;
  }

  return false;
};

const isLogged = (player: player | null = getPlayer()) => player !== null;

const setPlayer = (player: player | null) => {
  cachedPlayer = player;
  localStorage.setItem(LS_PLAYER_KEY, JSON.stringify(player));

  return player;
};

const getPlayer = () => {
  try {
    if (cachedPlayer !== null) return cachedPlayer;

    return setPlayer(
      JSON.parse(localStorage.getItem(LS_PLAYER_KEY) ?? "") as player
    );
  } catch (error) {
    return setPlayer(null);
  }
};

export { login, isAuthorized, getPlayer, setPlayer };
