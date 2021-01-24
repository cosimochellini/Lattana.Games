<template>
  <div class="container m-auto p-4">
    <p>Inserisci nuova partita di secret hitler ☠☠</p>
    <div>
      <user-autocomplete
        class="w-full"
        v-model="playerToAdd"
        :excludedPlayers="excludedPlayers"
      />
      <button
        class="bg-blue-500 px-2 text-pink-50 py-1 block p-1 mt-2 md:w-1/4 w-full"
        @click.prevent="addPlayer"
        v-show="playerToAdd?.nickname"
      >
        aggiungi giocatore
      </button>
    </div>
    <h3>Giocatori da smistare</h3>
    <draggable :list="remainingPlayers" group="people" itemKey="_id">
      <template #header> </template>
      <template #item="{ element }">
        <div
          class="border list-none rounded-md px-3 py-3 bg-gray-50 my-1 flex justify-evenly items-center"
        >
          <span
            class="ml-2 text-gray-700 font-semibold font-sans tracking-wide text-left"
          >
            {{ element.name }} {{ element.surname }}
          </span>
          <img
            class="w-10 h-10 rounded-full text-right"
            :src="image(element.profileImage).width(100)"
          />
        </div>
      </template>
    </draggable>

    <h3>Giocatori liberali</h3>
    <draggable
      :list="liberalPlayers"
      group="people"
      itemKey="_id"
      class="p-4 border border-red-500"
    >
      <template #item="{ element }">
        <div
          class="border list-none rounded-md px-3 py-3 bg-blue-50 my-1 flex justify-evenly items-center"
        >
          <span
            class="ml-2 text-gray-700 font-semibold font-sans tracking-wide text-left"
          >
            {{ element.name }} {{ element.surname }}
          </span>
          <img
            class="w-10 h-10 rounded-full text-right"
            :src="image(element.profileImage).width(100)"
          />
        </div>
      </template>
    </draggable>
    <h3>Giocatori fascisti</h3>
    <draggable
      :list="fascistPlayers"
      group="people"
      itemKey="_id"
      class="p-4 border border-red-500 block"
    >
      <template #item="{ element }">
        <div
          class="border list-none rounded-md px-3 py-3 bg-red-50 my-1 flex justify-evenly items-center"
        >
          <span
            class="ml-2 text-gray-700 font-semibold font-sans tracking-wide text-left"
          >
            {{ element.name }} {{ element.surname }}
          </span>
          <img
            class="w-10 h-10 rounded-full text-right"
            :src="image(element.profileImage).width(100)"
          />
        </div>
      </template>
    </draggable>

    <form @submit.prevent="saveMatch" class="flex flex-col items-center">
      <div class="base-card w-full mx-2 py-4">
        <label> Ruolo vincitore </label>
        <select
          v-model="winningRole"
          class="w-full shadow-md rounded-sm bg-gray-200 p-2"
        >
          <option v-for="role in allRoles" :key="role" :value="role">
            {{ role }}
          </option>
        </select>
      </div>
      <!-- <div
        class="sm:w-4/5 md:w-1/2 w-full"
        v-for="(player, i) in players"
        :key="player._id"
      >
        <secret-hitler-player
          class="mx-2 mt-2 bg-gray-400"
          :excludedPlayers="players"
          :label="`Giocatore ${i + 1}`"
          :model-value="player"
          :key="i"
          @update:modelValue="updatePlayer(i, $event)"
        />
      </div> -->

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
// import { uuid } from "@/utils/uuid";
import { defineComponent } from "vue";
import draggable from "vuedraggable";
import { secretHitlerRole } from "@/constants/roleConstants";
import { notificationService } from "@/services/notificationService";
import { secretHitlerService } from "@/services/games/secretHitlerService";

import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { urlFor } from "@/instances/sanity";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";

import {
  player,
  secretHitlerMatch,
  secretHitlerMatchPlayer,
} from "@/types/sanity";

const image = (img: SanityImageSource) => urlFor(img).width(100);

export default defineComponent({
  components: { UserAutocomplete, draggable },
  name: "secretHitlerNew",

  data() {
    return {
      playerToAdd: {} as player,
      allRoles: secretHitlerRole,
      winningRole: secretHitlerRole.liberal,
      remainingPlayers: [] as player[],
      liberalPlayers: [] as player[],
      fascistPlayers: [] as player[],
    };
  },
  mounted() {},
  methods: {
    image,
    saveMatch() {
      try {
        const matchToSave = {
          matchDate: new Date(),
          winningRole: this.winningRole,
          players: this.totalPlayers,
        } as secretHitlerMatch;

        secretHitlerService
          .saveNewMatch(matchToSave)
          .then(() => notificationService.success("salvataggio eseguito"))
          .catch(notificationService.danger)
          .finally(() => this.$router.push({ name: "secretHitlerHistory" }));
      } catch (error) {
        notificationService.danger(error);
      }
    },
    addPlayer() {
      this.remainingPlayers.push(this.playerToAdd);
      this.playerToAdd = {} as player;
    },
    updateElement(index: number, p: player) {
      this.remainingPlayers[index] = { ...this.remainingPlayers[index], ...p };
    },
    bindPlayer(player: player, role: secretHitlerRole) {
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
          this.bindPlayer(p, secretHitlerRole.fascist)
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