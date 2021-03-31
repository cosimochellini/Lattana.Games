import { player } from "@/types";
import { clone } from "./clone.service";
import { groq } from "@/utils/GroqQueryBuilder";
import { sanityClient } from "@/instances/sanity";
import { notification } from "./notification.service";
import { reactiveStorage } from "./reactiveStorage.service";
import { roleConstants, sanityTypes } from "@/constants/roleConstants";

const LS_PLAYER_KEY = "LG_STORED_USER";

const loginQuery = new groq.QueryBuilder(sanityTypes.player)
  .select(`..., 'roles': roles[]->role->name`)
  .get(new groq.PaginationBuilder().first())
  .freeze();

const currentPlayer = reactiveStorage<player | null>(LS_PLAYER_KEY, null);

export const auth = {
  get currentPlayer(): Readonly<player> {
    return currentPlayer.value as Readonly<player>;
  },

  get editablePlayer(): player {
    return clone.deepClone(currentPlayer.value as player);
  },

  login(name: string, pin: string) {
    return loginQuery
      .where(
        new groq.ConditionBuilder(
          "(nickname == $name && pin == $pin) || (email == $name && pin == $pin)"
        ).params({ name: name.toLowerCase(), pin: Number.parseInt(pin) })
      )
      .fetch<player | null>()
      .then((p) => (currentPlayer.value = p))
      .catch(notification.danger);
  },

  logout() {
    localStorage.clear();
  },

  updatePlayer(player: player) {
    return sanityClient.createOrReplace(player).then((p) => {
      currentPlayer.value = p;
      return currentPlayer.value;
    });
  },

  isAuthorized(roles: roleConstants[] = []): boolean {
    try {
      if (currentPlayer.value === null) return false;

      if (!roles.length) return true;

      if (currentPlayer.value.roles.includes(roleConstants.Admin)) return true;

      return currentPlayer.value.roles.some((r) => roles.includes(r));
    } catch (error) {
      return false;
    }
  },
};
