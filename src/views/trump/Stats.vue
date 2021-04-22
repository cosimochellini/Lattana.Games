<template>
  <div class="max-w-xl md:max-w-4xl px-4 py-2 mx-auto">
    <div class="font-semibold my-2">
      <h2
        class="base-subtitle my-1 py-1 first-capitalize"
        v-t="'trump.form.currentPlayer'"
      />

      <user-autocomplete
        v-model="currentPlayer"
        class="block px-2 py-1"
        :exactPlayers="availablePlayers"
      />
    </div>
    <stats-list :statistics="statistics" :game="'trump'" />

    <mate-section
      :best="mates.best"
      :worst="mates.worst"
      :game="'trump'"
      class="mt-2 pt-2"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/services/auth.service";
import { user } from "@/services/user.service";
import { player, trumpMatchPlayer } from "@/types";
import { trump } from "@/services/games/trump.service";
import MateSection from "@/components/base/MateSection.vue";
import StatsList from "@/components/base/ReadableStats.vue";
import { TrumpStats } from "@/utils/classes/stats/trumpMatchStats";
import { Mate, ReadableStats } from "@/utils/classes/stats/baseStats";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";

export default defineComponent({
  components: { UserAutocomplete, StatsList, MateSection },
  data() {
    return {
      availablePlayers: [] as player[],
      currentPlayer: auth.currentPlayer,
      stats: new TrumpStats([], auth.currentPlayer),
    };
  },
  mounted() {
    this.loadMatches();

    user
      .getActualTrumpPlayers()
      .then((players) => (this.availablePlayers = players));
  },
  methods: {
    loadMatches() {
      trump.getStats(this.currentPlayer).then((stats) => (this.stats = stats));
    },
  },
  watch: {
    currentPlayer: {
      handler() {
        this.loadMatches();
      },
      deep: true,
    },
  },
  computed: {
    statistics(): ReadableStats<trumpMatchPlayer>[] {
      return this.stats.GetReadableStats();
    },
    mates(): { best: Mate[]; worst: Mate[] } {
      return {
        best: this.stats.bestMates.slice(0, 5),
        worst: this.stats.worstOpponents.slice(0, 5),
      };
    },
  },
});
</script>

<style>
</style>