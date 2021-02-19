<template>
  <div class="container m-auto p-4">
    <h2 class="base-title my-1 py-1">
      Aggiungi nuova partita di secret hitler ☠
    </h2>
    <div class="flex flex-col items-center">
      <draggable
        :list="remainingPlayers"
        group="people"
        itemKey="_id"
        class="base-card card-width"
      >
        <template #header>
          <h2 class="base-subtitle">Giocatori da smistare</h2>

          <user-autocomplete
            class="w-full"
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
          <draggable-user :user="element" color="bg-blue-100" />
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
          <draggable-user :user="element" color="bg-red-100" />
        </template>
      </draggable>
    </div>
    <form @submit.prevent="saveMatch" class="flex flex-col items-center mt-2">
      <div class="base-card w-full mx-2 py-4 card-width">
        <h2 class="base-subtitle">Ruolo vincitore</h2>
        <select v-model="winningRole" class="base-select w-full">
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

      <button class="base-button primary mt-1" @click.prevent="saveMatch">
        {{ $t("buttons.base.save") }}
        <i class="fas fa-save ml-1"></i>
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import { defineComponent } from "vue";
import { overlayService } from "@/services/overlayService";
import DraggableUser from "@/components/base/DraggableUser.vue";
import { notificationService } from "@/services/notificationService";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";
import { sanityTypes, secretHitlerRole } from "@/constants/roleConstants";
import { secretHitlerService } from "@/services/games/secretHitlerService";
import { ConditionBuilder, QueryBuilder } from "@/utils/sanityQueryBuilder";

import {
  player,
  secretHitlerMatch,
  secretHitlerMatchPlayer,
} from "@/types/sanity";

const playersQuery = new QueryBuilder(sanityTypes.secretHitlerMatchPlayer)
  .select("player ->")
  .cached();

export default defineComponent({
  components: { UserAutocomplete, draggable, DraggableUser },
  name: "secretHitlerNew",

  data() {
    return {
      hitlerPlayer: {} as player,
      allRoles: [secretHitlerRole.fascist, secretHitlerRole.liberal],
      winningRole: secretHitlerRole.liberal,
      remainingPlayers: [] as player[],
      liberalPlayers: [] as player[],
      fascistPlayers: [] as player[],
    };
  },
  mounted() {
    if (this.$route.query.ref) {
      playersQuery
        .where(
          new ConditionBuilder("match._ref== $match").params({
            match: this.$route.query.ref as string,
          })
        )
        .fetch<secretHitlerMatchPlayer[]>()
        .then(
          (players) => (this.remainingPlayers = players.map((x) => x.player))
        );
    }
  },
  methods: {
    saveMatch() {
      try {
        const matchToSave: Partial<secretHitlerMatch> = {
          matchDate: new Date(),
          winningRole: this.winningRole,
          players: this.totalPlayers,
        };

        overlayService.showOverlay();

        secretHitlerService
          .saveNewMatch(matchToSave)
          .then(() => notificationService.success("salvataggio eseguito"))
          .catch(notificationService.danger)
          .finally(() => this.$router.push({ name: "secretHitlerHistory" }));
      } catch (error) {
        notificationService.danger(error);
      }
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
      const isHitler = player._id === hitlerPlayer?._id;
      const fascistAreWinning = role === this.winningRole;
      const win = this.winningRole === role;

      return {
        role,
        player,
        win: win || (isHitler && fascistAreWinning),
      } as secretHitlerMatchPlayer;
    },
  },
  computed: {
    totalPlayers(): secretHitlerMatchPlayer[] {
      return [
        ...this.liberalPlayers.map((p) =>
          this.bindPlayer(p, secretHitlerRole.liberal)
        ),
        ...this.fascistPlayers.map((p) =>
          this.bindPlayer(p, secretHitlerRole.fascist, this.hitlerPlayer)
        ),
      ];
    },
    excludedPlayers(): player[] {
      return this.totalPlayers
        .map((x) => x.player)
        .concat(this.remainingPlayers);
    },
  },
});
</script>

<style>
.card-width {
  @apply sm:w-4/5 md:w-1/2 w-full;
}
</style>