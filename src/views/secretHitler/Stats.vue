<template>
  <div class="max-w-xl md:max-w-4xl px-4 py-4 mx-auto">
    <div class="my-4">
      <h2 class="base-subtitle first-capitalize">
        {{ $t("secretHitler.form.currentPlayer") }}
      </h2>
      <user-autocomplete
        v-model="currentPlayer"
        :exactPlayers="availablePlayers"
        class="block px-2 py-1"
      />
    </div>
    <h2 class="base-title">
      {{ $t("secretHitler.titles.stats") }}
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
            {{ $t("secretHitler.stats." + statistic.message) }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="sm:grid sm:grid-flow-row sm:gap-4 sm:grid-cols-1 md:grid-cols-2"
    >
      <div>
        <h3 class="base-subtitle first-capitalize mt-2">
          {{ $t("secretHitler.titles.bestMatches") }} 👑
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
                :class="tailwind.shared.backgroundRatio(mate.ratio)"
              >
                {{ formatter.percentageFormatter(mate.ratio) }} %
              </span>
            </span>
          </div>
        </div>
      </div>
      <div>
        <h3 class="base-subtitle first-capitalize mt-2">
          {{ $t("secretHitler.titles.worstEnemies") }} 😱
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
                :class="tailwind.shared.backgroundRatio(mate.ratio, true)"
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
import { formatter } from "@/utils/formatters";
import { auth } from "@/services/auth.service";
import { user } from "@/services/user.service";
import { tailwind } from "@/services/tailwind.service";
import { Mate } from "@/utils/classes/stats/baseStats";
import { secretHitler } from "@/services/games/secretHitler.service";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";
import { SecretHitlerStats } from "@/utils/classes/stats/secretHitlerMatchStats";

export default defineComponent({
  components: { UserAutocomplete },
  data() {
    return {
      tailwind,
      formatter,
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
    image,
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
    statistics(): { message: string; value: string | number }[] {
      if (!this.stats.matches) return [];

      const { matches, wonMatches, lostMatches, ratio } = this.stats;
      const { penaltyPoints, liberalMatches, hitlerMatches } = this.stats;
      const { fascistMatches } = this.stats;

      return [
        { message: "totalMatches", value: matches.length },
        { message: "totalWin", value: wonMatches.length },
        { message: "totalLose", value: lostMatches.length },
        { message: "win", value: `${formatter.percentageFormatter(ratio)} %` },
        { message: "penaltyPoints", value: penaltyPoints.length },
        { message: "liberals", value: liberalMatches.length },
        { message: "fascists", value: fascistMatches.length },
        { message: "hitlers", value: hitlerMatches.length },
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