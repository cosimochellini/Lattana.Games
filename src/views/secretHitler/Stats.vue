<template>
  <div class="max-w-xl md:max-w-4xl px-4 py-2 mx-auto">
    <current-user
      :playerRetriever="user.getActualSecretHitlerPlayers"
      v-model="currentPlayer"
    />

    <stats-list :statistics="statistics" :game="currentGame" />

    <mate-list
      :best="mates.best"
      :worst="mates.worst"
      :game="currentGame"
      class="mt-2 pt-2"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/services/auth.service";
import { user } from "@/services/user.service";
import { secretHitlerMatchPlayer } from "@/types";
import MateList from "@/components/base/MateSection.vue";
import CurrentUser from "@/components/base/CurrentUser.vue";
import StatsList from "@/components/base/ReadableStats.vue";
import { secretHitler } from "@/services/games/secretHitler.service";
import { Mate, ReadableStats } from "@/utils/classes/stats/baseStats";
import { SecretHitlerStats } from "@/utils/classes/stats/secretHitlerMatchStats";
import { games } from "@/constants";

export default defineComponent({
  components: { StatsList, MateList, CurrentUser },
  name: "SecretHitlerStatsComponent",
  data() {
    return {
      user,
      currentGame: games.secretHitler,
      currentPlayer: auth.currentPlayer,
      stats: new SecretHitlerStats([], auth.currentPlayer),
    };
  },
  mounted() {
    this.loadMatches();
  },
  methods: {
    loadMatches() {
      secretHitler
        .getStats(this.currentPlayer)
        .then((stats) => (this.stats = stats));
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
    statistics(): ReadableStats<secretHitlerMatchPlayer>[] {
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
