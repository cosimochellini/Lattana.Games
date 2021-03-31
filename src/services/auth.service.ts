import { watch } from "vue";
import { player } from "@/types";
import { clone } from "./clone.service";
import { groq } from "@/utils/GroqQueryBuilder";
import { sanityClient } from "@/instances/sanity";
import { notification } from "./notification.service";
import { reactiveStorage } from "./reactiveStorage.service";
import { playerRole, sanityTypes } from "@/constants/roleConstants";

const currentPlayer = reactiveStorage<player | null>("LG_STORED_USER", null);

export const auth = {
  get currentPlayer(): Readonly<player> {
    return currentPlayer.value as Readonly<player>;
  },

  get editablePlayer(): player {
    return clone.deepClone(currentPlayer.value as player);
  },

  login(name: string, pin: string) {
    return new groq.QueryBuilder(sanityTypes.player)
      .select(`..., roles[]-> {..., role ->}`)
      .get(new groq.PaginationBuilder().first())
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

  onPlayerUpdate(hook: (player: player) => void) {
    watch(currentPlayer, (p) => hook(p as player));
  },

  async updatePlayer(player: player) {
    await sanityClient.createOrReplace(player);

    await this.login(player.nickname, player.pin.toString());

    return currentPlayer.value;
  },

  async updateProfileImage(file: File | undefined) {
    if (!file) return;

    await sanityClient.assets
      .upload("image", file)
      .then((asset) =>
        sanityClient
          .patch(auth.currentPlayer._id)
          .set({
            profileImage: {
              _type: "image",
              asset: { _type: "reference", _ref: asset._id },
            },
          })
          .commit()
          .catch(console.error)
      )
      .catch(console.error);

    await this.login(
      this.currentPlayer.nickname,
      this.currentPlayer.pin.toString()
    );
  },

  isAuthorized(roles: playerRole[] = []): boolean {
    try {
      if (currentPlayer.value === null) return false;

      if (!roles.length) return true;

      if (currentPlayer.value.roles.includes(playerRole.admin)) return true;

      return currentPlayer.value.roles.some((r) => roles.includes(r));
    } catch (error) {
      return false;
    }
  },
};
