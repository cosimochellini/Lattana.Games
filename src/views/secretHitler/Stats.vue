<template>
  <div class="max-w-xl md:max-w-4xl px-4 py-4 mx-auto">
    <div class="my-4">
      <h2
        class="base-subtitle first-capitalize"
        v-t="'secretHitler.form.currentPlayer'"
      />

      <user-autocomplete
        v-model="currentPlayer"
        class="block px-2 py-1"
        :exactPlayers="availablePlayers"
      />
    </div>

    <stats-list :statistics="statistics" :game="'secretHitler'" />

    <mate-list
      :best="mates.best"
      :worst="mates.worst"
      :game="'secretHitler'"
      class="mt-2 pt-2"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/services/auth.service";
import { user } from "@/services/user.service";
import MateList from "@/components/base/MateList.vue";
import { player, secretHitlerMatchPlayer } from "@/types";
import StatsList from "@/components/base/ReadableStats.vue";
import { secretHitler } from "@/services/games/secretHitler.service";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";
import { Mate, ReadableStats } from "@/utils/classes/stats/baseStats";
import { SecretHitlerStats } from "@/utils/classes/stats/secretHitlerMatchStats";

export default defineComponent({
  components: { UserAutocomplete, StatsList, MateList },
  data() {
    return {
      availablePlayers: [] as player[],
      currentPlayer: auth.currentPlayer,
      stats: new SecretHitlerStats([], auth.currentPlayer),
    };
  },
  mounted() {
    this.loadMatches();

    user
      .getActualSecretHitlerPlayers()
      .then((players) => (this.availablePlayers = players));
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