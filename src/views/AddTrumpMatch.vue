<template>
  <div class="containter m-auto p-4">
    <p>Inserisci nuova partita di briscola in 5</p>
    <form @submit.prevent="saveMatch" class="flex flex-col items-center">
      <trump-match-player
        class="md:w-1/4 w-full"
        :exclutedPlayers="allPlayers"
        label="Giocatore 1"
        v-model="players.player1"
        @input="(p) => (players.player1 = p)"
      />
      <!-- TODO : rimuovere i @input, sono momentanei perchè il v-model non va -->
      <trump-match-player
        class="md:w-1/4 w-full"
        :exclutedPlayers="allPlayers"
        label="Giocatore 2"
        v-model="players.player2"
        @input="(p) => (players.player2 = p)"
      />
      <trump-match-player
        class="md:w-1/4 w-full"
        :exclutedPlayers="allPlayers"
        label="Giocatore 3"
        v-model="players.player3"
        @input="(p) => (players.player3 = p)"
      />
      <trump-match-player
        class="md:w-1/4 w-full"
        :exclutedPlayers="allPlayers"
        label="Giocatore 4"
        v-model="players.player4"
        @input="(p) => (players.player4 = p)"
      />
      <trump-match-player
        class="md:w-1/4 w-full"
        :exclutedPlayers="allPlayers"
        label="Giocatore 5"
        v-model="players.player5"
        @input="(p) => (players.player5 = p)"
      />
      <div
        class="border-4 border-blue-500 border-opacity-50 rounded-md m-2 flex flex-col items-stretch justify-between md:w-1/4 w-full"
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
import { player, trumpMatch, trumpMatchPlayer } from "@/types/sanity";
import { saveNewMatch } from "@/services/matchService";
import TrumpMatchPlayer from "@/components/form/TrumpMatchPlayer.vue";

export default defineComponent({
  components: { TrumpMatchPlayer },
  name: "AddTrumpMatch",
  data() {
    return {
      players: {
        player1: {} as trumpMatchPlayer,
        player2: {} as trumpMatchPlayer,
        player3: {} as trumpMatchPlayer,
        player4: {} as trumpMatchPlayer,
        player5: {} as trumpMatchPlayer,
      },
      startingScore: 0,
      finalScore: 0,
    };
  },
  methods: {
    async saveMatch() {
      try {
        await saveNewMatch({
          matchDate: new Date(),
          startingScore: this.startingScore,
          finalScore: this.finalScore,
          callingPlayer: this.allPlayers[0],
          players: this.allMatchPlayers,
        } as trumpMatch);
      } catch (error) {
        console.error(error);
      }
    },
  },
  computed: {
    allMatchPlayers(): trumpMatchPlayer[] {
      const { player1, player2, player3, player4, player5 } = this.players;

      return [player1, player2, player3, player4, player5];
    },
    allPlayers(): player[] {
      return this.allMatchPlayers.map((x) => x.player).filter((p) => p?._id);
    },
  },
});
</script>

<style>
</style>