import { watch } from "vue";
import { player } from "@/types";
import { deepClone } from "@/utils";
import { overlay } from "./overlay.service";
import { groq } from "@/utils/GroqQueryBuilder";
import { sanityClient } from "@/instances/sanity";
import { notification } from "./notification.service";
import { reactiveStorage } from "./reactiveStorage.service";
import { role, sanityTypes } from "@/constants/roleConstants";

const currentPlayer = reactiveStorage<player | null>("LG_STORED_USER", null);

export const auth = {
  get currentPlayer(): Readonly<player> {
    return currentPlayer.value as Readonly<player>;
  },

  get editablePlayer(): player {
    return deepClone(currentPlayer.value as player);
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

  onPlayerUpdate(hook: () => void) {
    watch(currentPlayer, hook);
  },

  async updatePlayer(player: player) {
    overlay.show();

    await sanityClient.createOrReplace(player);

    await this.login(player.nickname, player.pin.toString());

    overlay.hide();

    return currentPlayer.value;
  },

  async updateProfileImage(file: File | undefined) {
    if (!file) return;
    overlay.show();

    await sanityClient.assets.upload("image", file).then((asset) =>
      sanityClient
        .patch(auth.currentPlayer._id)
        .set({
          profileImage: {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
          },
        })
        .commit()
        .then(overlay.hide)
        .catch(console.error)
    );

    await this.login(
      this.currentPlayer.nickname,
      this.currentPlayer.pin.toString()
    );
  },

  isAuthorized(roles: role[] | null = null): boolean {
    try {
      if (currentPlayer.value === null) return false;

      if (!roles?.length) return true;

      if (currentPlayer.value.roles?.includes(role.admin)) return true;

      for (const role of roles)
        if (currentPlayer.value.roles?.includes(role)) return true;

      return false;
    } catch (error) {
      return false;
    }
  },
};
