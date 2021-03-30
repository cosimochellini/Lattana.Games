<template>
  <div class="container m-auto p-4">
    <div class="flex flex-col items-center">
      <h2 class="base-title first-capitalize">
        {{ $t("secretHitler.titles.insertNewMatch") }}
      </h2>
      <draggable
        :list="remainingPlayers"
        group="people"
        itemKey="_id"
        class="base-card card-width"
        v-if="!(!remainingPlayers.length && totalPlayers.length === 10)"
      >
        <template #header>
          <h2 class="base-subtitle">
            {{ $t("secretHitler.form.remainingPlayers") }}
          </h2>

          <user-autocomplete
            class="w-full"
            v-show="totalPlayers.length + remainingPlayers.length < 10"
            :excludedPlayers="excludedPlayers"
            @update:modelValue="addPlayer"
          />
        </template>
        <template #item="{ element }">
          <draggable-user
            :user="element"
            showDelete
            @deletePlayer="deletePlayer"
          />
        </template>
      </draggable>

      <draggable
        :list="liberalPlayers"
        group="people"
        itemKey="_id"
        class="base-card mt-2 card-width"
      >
        <template #header>
          <h2 class="base-subtitle">Giocatori liberali</h2>
        </template>
        <template #item="{ element }">
          <draggable-user
            color="bg-blue-100"
            :user="element"
            :avatarColor="
              tailwind.winRingColor(winningRole === secretHitlerRole.liberal)
            "
          />
        </template>
      </draggable>

      <draggable
        :list="fascistPlayers"
        group="people"
        itemKey="_id"
        class="base-card mt-2 card-width"
      >
        <template #header>
          <h2 class="base-subtitle">Giocatori fascisti</h2>
        </template>
        <template #item="{ element }">
          <draggable-user
            :user="element"
            :color="
              element._id === hitlerPlayer._id ? 'bg-gray-300' : 'bg-red-100'
            "
            :avatarColor="
              tailwind.winRingColor(winningRole === secretHitlerRole.liberal)
            "
          />
        </template>
      </draggable>
    </div>
    <form @submit.prevent="saveMatch" class="flex flex-col items-center mt-2">
      <div class="base-card w-full mx-2 py-4 card-width">
        <h2 class="base-subtitle">Ruolo vincitore</h2>
        <select v-model="winningRole" class="base-select w-full">
          <option value="" disabled>seleziona ruolo</option>
          <option v-for="role in allRoles" :key="role" :value="role">
            {{ $t(`secretHitler.roles.${role}`) }}
          </option>
        </select>

        <h2 class="base-subtitle">Hitler</h2>
        <user-autocomplete
          :exactPlayers="fascistPlayers"
          class="w-full"
          v-model="hitlerPlayer"
        />
      </div>

      <button
        class="base-button primary large mt-1"
        @click.prevent="saveMatch"
        :disabled="!contextValidated"
      >
        <span>
          {{ $t("buttons.base.save") }}
        </span>
        <i class="fas fa-save ml-1"></i>
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import { range } from "@/utils/range";
import { defineComponent } from "vue";
import { byString, byValue } from "sort-es";
import { mergeObjects } from "@/utils/merge";
import { groq } from "@/utils/GroqQueryBuilder";
import { tailwind } from "@/services/tailwind.service";
import { queryRefresh } from "@/composable/routerRefresh";
import { notification } from "@/services/notification.service";
import DraggableUser from "@/components/base/DraggableUser.vue";
import { secretHitler } from "@/services/games/secretHitler.service";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";
import { sanityTypes, secretHitlerRole } from "@/constants/roleConstants";
import { player, secretHitlerMatch, secretHitlerMatchPlayer } from "@/types";

const playersQuery = new groq.QueryBuilder(
  sanityTypes.secretHitlerMatchPlayer
).select("player ->");

const initialData = () => ({
  secretHitlerRole,
  hitlerPlayer: {} as player,
  allRoles: [secretHitlerRole.fascist, secretHitlerRole.liberal],
  winningRole: "" as secretHitlerRole,
  remainingPlayers: [] as player[],
  liberalPlayers: [] as player[],
  fascistPlayers: [] as player[],
  tailwind,
});
export default defineComponent({
  components: { UserAutocomplete, draggable, DraggableUser },
  name: "secretHitlerNew",
  data: initialData,
  activated() {
    this.remainingPlayers = [];
    if (!this.$route.query.ref) return;

    playersQuery
      .where(
        new groq.ConditionBuilder("match._ref== $match").params({
          match: this.$route.query.ref,
        })
      )
      .fetch<secretHitlerMatchPlayer[]>()
      .then((players) => {
        this.remainingPlayers = players
          .map((x) => x.player)
          .sort(byValue((x) => x.name, byString()));
      });
  },
  deactivated() {
    this.$nextTick(() => mergeObjects(this.$data, initialData()));
  },
  methods: {
    saveMatch() {
      const matchToSave: Partial<secretHitlerMatch> = {
        matchDate: new Date(),
        winningRole: this.winningRole,
        players: this.totalPlayers,
      };

      return secretHitler
        .saveNewMatch(matchToSave)
        .then(() => notification.success("salvataggio eseguito"))
        .catch(notification.danger)
        .finally(() =>
          this.$router.push({
            name: "secretHitlerHistory",
            query: queryRefresh,
          })
        );
    },
    addPlayer(player: player) {
      this.remainingPlayers.push(player);
    },
    deletePlayer(player: player) {
      this.remainingPlayers = this.remainingPlayers.filter(
        (p) => p._id !== player._id
      );
    },
    updateElement(index: number, p: player) {
      this.remainingPlayers[index] = { ...this.remainingPlayers[index], ...p };
    },
    bindPlayer(
      player: player,
      role: secretHitlerRole,
      hitlerPlayer: player | null = null
    ) {
      const win = this.winningRole === role;
      const isHitler = player._id === hitlerPlayer?._id;
      const fascistAreWinning = role === this.winningRole;

      return {
        player,
        win: win || (isHitler && fascistAreWinning),
        role: isHitler ? secretHitlerRole.hitler : role,
      } as secretHitlerMatchPlayer;
    },
  },
  computed: {
    totalPlayers(): secretHitlerMatchPlayer[] {
      return [
        ...this.liberalPlayers
          .map((p) => this.bindPlayer(p, secretHitlerRole.liberal))
          .concat(
            this.fascistPlayers.map((p) =>
              this.bindPlayer(p, secretHitlerRole.fascist, this.hitlerPlayer)
            )
          ),
      ];
    },
    excludedPlayers(): player[] {
      return this.totalPlayers
        .map((x) => x.player)
        .concat(this.remainingPlayers);
    },
    contextValidated(): boolean {
      const difference =
        this.liberalPlayers.length - this.fascistPlayers.length;

      const hitlerSelected = !!this.hitlerPlayer._id;
      const winningRoleSelected = !!this.winningRole;
      const noRemaingPlayers = this.remainingPlayers.length === 0;
      const correctPlayersNumber = range([6, 11], this.totalPlayers.length);
      const correctPlayerDistribution = range([1, 2], difference);

      return (
        hitlerSelected &&
        noRemaingPlayers &&
        winningRoleSelected &&
        correctPlayersNumber &&
        correctPlayerDistribution
      );
    },
  },
});
</script>

<style>
.card-width {
  @apply w-full md:w-10/12 lg:w-4/5 xl:w-3/5 2xl:w-2/5;
}
</style>