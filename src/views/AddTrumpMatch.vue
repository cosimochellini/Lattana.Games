<template>
  <div class="justify-items-center m-auto max-w-6xl">
    <p>Inserisci nuova partita</p>
    <form>
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
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { player } from "@/types/sanity";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";

export default defineComponent({
  components: { UserAutocomplete },
  name: "AddTrumpMatch",
  data() {
    return {
      players: [] as player[],
    };
  },
  methods: {
    addPlayer(player: player) {
      this.players = [...this.players, player];
    },
    removePlayer(player: player) {
      this.players = this.players.filter((x) => x._id !== player._id);
    },
  },
});
</script>

<style>
</style>