<template>
  <div class="max-w-xl md:max-w-4xl px-4 py-4 mx-auto">
    <div class="font-semibold my-4">
      <h2 class="base-subtitle my-1 py-1 first-capitalize">
        {{ $t("trump.form.currentPlayer") }}
      </h2>
      <user-autocomplete
        v-model="currentPlayer"
        class="block px-2 py-1"
        :exactPlayers="availablePlayers"
      />
    </div>
    <h2 class="base-title my-1 py-1 first-capitalize">
      {{ $t("trump.titles.stats") }} 📊
    </h2>
    <div
      class="grid grid-flow-row gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
    >
      <div
        class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded"
        v-for="statistic in statistics"
        :key="statistic.message"
      >
        <div>
          <p class="text-3xl font-semibold text-center text-gray-800">
            {{ statistic.value }}
          </p>
          <p class="text-lg text-center text-gray-500">
            {{ $t("trump.stats." + statistic.message) }}
          </p>
        </div>
      </div>
    </div>

    <div
      class="sm:grid sm:grid-flow-row sm:gap-4 sm:grid-cols-1 md:grid-cols-2"
    >
      <div>
        <h3 class="base-subtitle first-capitalize">
          {{ $t("trump.titles.bestMatches") }} 👑
        </h3>

        <div
          class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded m-2"
          v-for="mate in topMates"
          :key="mate.player._id"
        >
          <div class="grid grid-cols-4 items-center">
            <span class="col-span-1 text-center m-auto">
              <img
                class="w-10 h-10 rounded-full"
                :src="image(mate.player.profileImage, 500)"
              />
            </span>
            <span
              class="col-span-2 text-gray-700 font-semibold font-sans tracking-wide text-center"
            >
              {{ mate.player.name }}
              {{ mate.player.surname }}
            </span>
            <span class="col-span-1 text-center">
              <span
                class="rounded-xl px-2 py-1 font-semibold"
                :class="tailwind.backgroundRatio(mate.ratio)"
              >
                {{ formatter.percentageFormatter(mate.ratio) }} %
              </span>
            </span>
          </div>
        </div>
      </div>
      <div>
        <h3 class="base-subtitle first-capitalize">
          {{ $t("trump.titles.worstEnemies") }} 😱
        </h3>
        <div
          class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded m-2"
          v-for="mate in worstOpponents"
          :key="mate.player._id"
        >
          <div class="grid grid-cols-4 items-center">
            <span class="col-span-1 text-center m-auto">
              <img
                class="w-10 h-10 rounded-full"
                :src="image(mate.player.profileImage, 500)"
              />
            </span>
            <span
              class="col-span-2 text-gray-700 font-semibold font-sans tracking-wide text-center"
            >
              {{ mate.player.name }}
              {{ mate.player.surname }}
            </span>
            <span class="col-span-1 text-center">
              <span
                class="rounded-xl px-2 py-1 font-semibold"
                :class="tailwind.backgroundRatio(mate.ratio, true)"
              >
                {{ formatter.percentageFormatter(mate.ratio) }} %
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { player } from "@/types";
import { defineComponent } from "vue";
import { image } from "@/instances/sanity";
import { auth } from "@/services/auth.service";
import { formatter } from "@/utils/formatters";
import { trump } from "@/services/games/trump.service";
import { tailwind } from "@/services/tailwind.service";
import { Mate } from "@/utils/classes/stats/baseStats";
import { TrumpStats } from "@/utils/classes/stats/trumpMatchStats";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";

export default defineComponent({
  components: { UserAutocomplete },
  data() {
    return {
      tailwind,
      formatter,
      availablePlayers: [] as player[],
      currentPlayer: auth.currentPlayer,
      stats: new TrumpStats([], auth.currentPlayer),
    };
  },
  mounted() {
    this.loadMatches();

    trump
      .getActualPlayers()
      .then((players) => (this.availablePlayers = players));
  },
  methods: {
    image,
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
    statistics(): { message: string; value: string | number }[] {
      const { matches, wonMatches, lostMatches, ratio } = this.stats;
      const { callingMatchesRatio } = this.stats;
      const { penaltyPoints, callingStats, fullScoreMatches } = this.stats;
      const { mediaScore } = callingStats;

      return [
        { message: "totalMatches", value: matches.length },
        { message: "totalWin", value: wonMatches.length },
        { message: "totalLose", value: lostMatches.length },
        { message: "win", value: `${formatter.percentageFormatter(ratio)} %` },
        { message: "penaltyPoints", value: penaltyPoints.length },
        { message: "120Match", value: fullScoreMatches.length },
        {
          message: "callingMatches",
          value: callingStats.matches.length,
        },
        {
          message: "callingMatches",
          value: `${formatter.percentageFormatter(callingMatchesRatio)} %`,
        },
        {
          message: "callingMatchesWin",
          value: `${formatter.percentageFormatter(callingStats.ratio)} %`,
        },
        {
          message: "mediaCallingScore",
          value: mediaScore.toFixed(0),
        },
      ];
    },
    topMates(): Mate[] {
      return this.stats.bestMates.slice(0, 5);
    },
    worstOpponents(): Mate[] {
      return this.stats.worstOpponents.slice(0, 5);
    },
  },
});
</script>

<style>
</style>