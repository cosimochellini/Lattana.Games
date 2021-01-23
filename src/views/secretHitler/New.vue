<template>
  <div class="container m-auto p-4">
    <p>Inserisci nuova partita di secret hitler ☠☠</p>
    <form @submit.prevent="saveMatch" class="flex flex-col items-center">
      <div class="base-card w-full mx-2 py-4">
        <label> Ruolo vincitore </label>
        <select v-model="winningRole" class="w-full shadow-md rounded-sm bg-gray-200 p-2">
          <option v-for="role in allRoles" :key="role" :value="role">
            {{ role }}
          </option>
        </select>
      </div>
      <div
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
      </div>
      <button
        class="bg-blue-500 px-2 text-pink-50 py-1 block p-1 mt-2 md:w-1/4 w-full"
        @click.prevent="addPlayer"
      >
        nuovo giocatore
      </button>
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
import { uuid } from "@/utils/uuid";
import { defineComponent } from "vue";
import { secretHitlerRole } from "@/constants/roleConstants";
import { notificationService } from "@/services/notificationService";
import SecretHitlerPlayer from "@/components/form/SecretHitlerPlayer.vue";
import { secretHitlerService } from "@/services/games/secretHitlerService";
import { secretHitlerMatch, secretHitlerMatchPlayer } from "@/types/sanity";

const newPlayer = () =>
  ({ _id: uuid(), role: secretHitlerRole.liberal } as secretHitlerMatchPlayer);

export default defineComponent({
  components: { SecretHitlerPlayer },
  name: "secretHitlerNew",
  data() {
    return {
      allRoles: secretHitlerRole,
      players: [] as secretHitlerMatchPlayer[],
      winningRole: secretHitlerRole.liberal,
    };
  },
  mounted() {},
  methods: {
    saveMatch() {
      try {
        const matchToSave = {
          matchDate: new Date(),
          winningRole: this.winningRole,
          players: this.players,
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
      this.players.push(newPlayer());
    },
    updatePlayer(index: number, p: secretHitlerMatchPlayer) {
      console.log({ ...p });
      this.players[index] = p;
    },
    removePlayer(id: string) {
      this.players = this.players.filter((x) => x._id !== id);
    },
  },
});
</script>

<style>
</style>