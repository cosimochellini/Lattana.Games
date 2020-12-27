<template>
  <div class="justify-items-center m-auto max-w-6xl p-4">
    <p>Inserisci nuova partita</p>
    <form @submit.prevent="saveMatch" class="flex flex-col">
      <user-autocomplete
        @select="addPlayer"
        @remove="removePlayer"
        label="Giocatore 1"
        :exclutedPlayers="players"
      />
      <user-autocomplete
        @select="addPlayer"
        @remove="removePlayer"
        label="Giocatore 2"
        :exclutedPlayers="players"
      />
      <user-autocomplete
        @select="addPlayer"
        @remove="removePlayer"
        label="Giocatore 3"
        :exclutedPlayers="players"
      />
      <user-autocomplete
        @select="addPlayer"
        @remove="removePlayer"
        label="Giocatore 4"
        :exclutedPlayers="players"
      />
      <user-autocomplete
        @select="addPlayer"
        @remove="removePlayer"
        label="Giocatore 5"
        :exclutedPlayers="players"
      />
      <label for="initial points"> punteggio chiamato</label>
      <input
        name="initial points"
        type="number"
        min="60"
        max="120"
        class="block pa-2 max-w-xs"
        v-model.number="startingScore"
      />

      <label for="initial points"> punteggio finale</label>
      <input
        name="initial points"
        type="number"
        min="60"
        max="120"
        class="block pa-2 max-w-xs"
        v-model.number="finalScore"
      />

      <button
        class="bg-blue-500 px-2 text-pink-50 py-1 block p-1 mt-2 max-w-xs"
        @click.prevent="saveMatch"
      >
        salva
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { player } from "@/types/sanity";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";
import { saveNewMatch } from "@/services/matchService";

export default defineComponent({
  components: { UserAutocomplete },
  name: "AddTrumpMatch",
  data() {
    return {
      players: [] as player[],
      startingScore: 0,
      finalScore: 0,
    };
  },
  methods: {
    addPlayer(player: player) {
      this.players = [...this.players, player];
    },
    removePlayer(player: player) {
      this.players = this.players.filter((x) => x._id !== player._id);
    },
    async saveMatch() {
      try {
        await saveNewMatch(this.players, this.startingScore, this.finalScore);
      } catch (error) {
        console.error(error);
        // eslint-disable-next-line no-debugger
        debugger;
      }
    },
  },
});
</script>

<style>
</style>