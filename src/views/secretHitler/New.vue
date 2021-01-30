<template>
  <div class="container m-auto p-4">
    <label class="font-semibold">
      Inserisci nuova partita di secret hitler ☠☠
    </label>

    <draggable
      :list="remainingPlayers"
      group="people"
      itemKey="_id"
      class="base-card"
    >
      <template #header>
        <label class="font-semibold"> Giocatori da smistare </label>

        <user-autocomplete
          class="w-full"
          :excludedPlayers="excludedPlayers"
          @update:modelValue="addPlayer"
        />
      </template>
      <template #item="{ element }">
        <draggable-user :user="element" showDelete @delete="deletePlayer" />
      </template>
    </draggable>

    <draggable
      :list="liberalPlayers"
      group="people"
      itemKey="_id"
      class="base-card mt-2 hover:border-2 hover:border-blue-400"
    >
      <template #header>
        <label class="font-semibold"> Giocatori liberali </label>
      </template>
      <template #item="{ element }">
        <draggable-user :user="element" color="bg-blue-100" />
      </template>
    </draggable>

    <draggable
      :list="fascistPlayers"
      group="people"
      itemKey="_id"
      class="base-card mt-2"
    >
      <template #header>
        <label class="font-semibold"> Giocatori fascisti </label>
      </template>
      <template #item="{ element }">
        <draggable-user :user="element" color="bg-red-100" />
      </template>
    </draggable>

    <form @submit.prevent="saveMatch" class="flex flex-col items-center mt-2">
      <div class="base-card w-full mx-2 py-4">
        <label class="font-semibold"> Ruolo vincitore </label>
        <select
          v-model="winningRole"
          class="w-full shadow-md rounded-sm bg-gray-200 p-2"
        >
          <option v-for="role in allRoles" :key="role" :value="role">
            {{ role }}
          </option>
        </select>

        <label class="font-semibold pt-1"> Hitler</label>

        <user-autocomplete
          :exactPlayers="fascistPlayers"
          class="w-full"
          v-model="hitlerPlayer"
        />
      </div>

      <button
        class="bg-blue-500 px-2 text-pink-50 py-1 block p-1 mt-2 md:w-1/4 w-full"
        @click.prevent="saveMatch"
      >
        salva
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import { defineComponent } from "vue";
import { urlFor } from "@/instances/sanity";
import { overlayService } from "@/services/overlayService";
import DraggableUser from "@/components/base/DraggableUser.vue";
import { notificationService } from "@/services/notificationService";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";
import { sanityTypes, secretHitlerRole } from "@/constants/roleConstants";
import { secretHitlerService } from "@/services/games/secretHitlerService";
import { ConditionBuilder, QueryBuilder } from "@/utils/sanityQueryBuilder";

import {
  player,
  secretHitlerMatch,
  secretHitlerMatchPlayer,
} from "@/types/sanity";

const image = (img: SanityImageSource) => urlFor(img).width(100);

const playersQuery = new QueryBuilder(
  sanityTypes.secretHitlerMatchPlayer
).select("player ->");

export default defineComponent({
  components: { UserAutocomplete, draggable, DraggableUser },
  name: "secretHitlerNew",

  data() {
    return {
      hitlerPlayer: {} as player,
      allRoles: secretHitlerRole,
      winningRole: secretHitlerRole.liberal,
      remainingPlayers: [] as player[],
      liberalPlayers: [] as player[],
      fascistPlayers: [] as player[],
      classes: {
        liberal: "",
      },
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
    image,
    saveMatch() {
      try {
        const matchToSave = {
          matchDate: new Date(),
          winningRole: this.winningRole,
          players: this.totalPlayers,
        } as secretHitlerMatch;

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
      hitler: player | null = null
    ) {
      if (role === secretHitlerRole.fascist && player._id === hitler?._id) {
        role = secretHitlerRole.hitler;
      }
      return {
        role,
        player,
        win: this.winningRole === role,
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
</style>