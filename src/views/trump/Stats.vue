<template>
  <div class="max-w-xl md:max-w-4xl px-4 py-2 mx-auto">
    <current-user
      :playerRetriever="user.getActualTrumpPlayers"
      v-model="currentPlayer"
    />
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
import CurrentUser from "@/components/base/CurrentUser.vue";
import StatsList from "@/components/base/ReadableStats.vue";
import { TrumpStats } from "@/utils/classes/stats/trumpMatchStats";
import { Mate, ReadableStats } from "@/utils/classes/stats/baseStats";

export default defineComponent({
  components: { StatsList, MateSection, CurrentUser },
  data() {
    return {
      user,
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