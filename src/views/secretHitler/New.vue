<template>
  <div class="container m-auto p-4">
    <p>Inserisci nuova partita di secret hitler</p>
    <form @submit.prevent="saveMatch" class="flex flex-col items-center">
      <trump-match-player
        class="sm:w-4/5 md:w-1/2 w-full"
        :excludedPlayers="allPlayers"
        label="Giocatore 1"
        v-model="players.player1"
      />
      <trump-match-player
        class="sm:w-4/5 md:w-1/2 w-full"
        :excludedPlayers="allPlayers"
        label="Giocatore 2"
        v-model="players.player2"
      />
      <trump-match-player
        class="sm:w-4/5 md:w-1/2 w-full"
        :excludedPlayers="allPlayers"
        label="Giocatore 3"
        v-model="players.player3"
      />
      <trump-match-player
        class="sm:w-4/5 md:w-1/2 w-full"
        :excludedPlayers="allPlayers"
        label="Giocatore 4"
        v-model="players.player4"
      />
      <trump-match-player
        class="sm:w-4/5 md:w-1/2 w-full"
        :excludedPlayers="allPlayers"
        label="Giocatore 5"
        v-model="players.player5"
      />
      <div
        class="border-4 border-blue-500 border-opacity-50 rounded-md m-2 p-4 flex flex-col items-stretch justify-between sm:w-4/5 md:w-1/2 w-full"
      >
        <label> Giocatore chiamate</label>
        <user-autocomplete :exactPlayers="allPlayers" v-model="callingPlayer" />
      </div>
      <div
        class="border-4 border-blue-500 border-opacity-50 rounded-md m-2 flex flex-col items-stretch justify-between sm:w-4/5 md:w-1/2 w-full"
      >
        <div class="m-2 flex justify-between">
          <label for="initial points"> punteggio chiamato</label>
          <input
            name="initial points"
            type="number"
            min="60"
            max="120"
            class="pa-2"
            v-model.number="startingScore"
          />
        </div>
        <div class="m-2 flex justify-between">
          <label for="initial points"> punteggio finale</label>
          <input
            name="initial points"
            type="number"
            min="60"
            max="120"
            v-model.number="finalScore"
          />
        </div>
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
import { defineComponent } from "vue";
import { secretHitlerRole } from "@/constants/roleConstants";
import { notificationService } from "@/services/notificationService";
import TrumpMatchPlayer from "@/components/form/TrumpMatchPlayer.vue";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";
import { secretHitlerService } from "@/services/games/secretHitlerService";
import { secretHitlerMatch, secretHitlerMatchPlayer } from "@/types/sanity";

export default defineComponent({
  components: { TrumpMatchPlayer, UserAutocomplete },
  name: "trumpNew",
  data() {
    return {
      players: [] as secretHitlerMatchPlayer[],
      winningRole: secretHitlerRole.liberal,
    };
  },
  mounted() {},
  methods: {
    async saveMatch() {
      try {
        const matchToSave = {
          matchDate: new Date(),
          winningRole: this.winningRole,
          players: this.players,
        } as secretHitlerMatch;

        secretHitlerService
          .saveNewMatch(matchToSave)
          .then(() => notificationService.success("salvataggio eseguito"))
          .catch(notificationService.danger);
      } catch (error) {
        notificationService.danger(error);
      }
    },
  },
});
</script>

<style>
</style>