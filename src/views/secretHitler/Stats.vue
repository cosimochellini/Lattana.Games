<template>
  <div class="max-w-xl md:max-w-4xl px-4 py-4 mx-auto">
    <div class="my-4">
      <h2 class="base-subtitle">Giocatore corrente</h2>
      <user-autocomplete v-model="currentPlayer" class="block px-2 py-1" />
    </div>
    <h2 class="base-title">Statistiche 📊</h2>
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
            {{ statistic.message }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="sm:grid sm:grid-flow-row sm:gap-4 sm:grid-cols-1 md:grid-cols-2"
    >
      <div>
        <h3 class="base-subtitle">Accoppiamenti migliori 👑</h3>

        <div
          class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded m-2"
          v-for="mate in topMates"
          :key="mate.player._id"
        >
          <div class="flex justify-evenly items-center">
            <img
              class="w-10 h-10 rounded-full"
              :src="image(mate.player.profileImage, 500)"
            />
            <span
              class="ml-2 text-gray-700 font-semibold font-sans tracking-wide"
            >
              {{ mate.nickname }}
            </span>
            <span
              class="ml-4 rounded-xl px-2 py-1 font-semibold"
              :class="mate.ratio > 0.5 ? 'bg-green-300' : 'bg-red-300'"
            >
              {{ percentageFormatter(mate.ratio) }} %
            </span>
          </div>
        </div>
      </div>
      <div>
        <h3 class="base-subtitle">Peggioni nemici 😱</h3>

        <div
          class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded m-2"
          v-for="mate in worstOpponents"
          :key="mate.player._id"
        >
          <div class="flex justify-around items-center">
            <img
              class="w-10 h-10 rounded-full"
              :src="image(mate.player.profileImage, 500)"
            />
            <span
              class="ml-2 text-gray-700 font-semibold font-sans tracking-wide"
            >
              {{ mate.nickname }}
            </span>
            <span
              class="ml-4 rounded-xl px-2 py-1 font-semibold"
              :class="mate.ratio < 0.5 ? 'bg-green-300' : 'bg-red-300'"
            >
              {{ percentageFormatter(mate.ratio) }} %
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { image } from "@/instances/sanity";
import { auth } from "@/services/auth.service";
import { groq } from "@/utils/GroqQueryBuilder";
import { Mate } from "@/utils/classes/stats/baseStats";
import { sanityTypes } from "@/constants/roleConstants";
import { secretHitlerMatchPlayer } from "@/types/sanity";
import { percentageFormatter } from "@/utils/formatters";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";
import { SecretHitlerStats } from "@/utils/classes/stats/secretHitlerMatchStats";

const matchesQuery = new groq.QueryBuilder(sanityTypes.secretHitlerMatchPlayer)
  .select("..., player ->, match -> {..., players[] -> {...,player -> } }")
  .cached()
  .freeze();

export default defineComponent({
  components: { UserAutocomplete },
  data() {
    return {
      matches: [] as secretHitlerMatchPlayer[],
      currentPlayer: auth.currentPlayer,
    };
  },
  mounted() {
    this.loadMatches();
  },
  methods: {
    image,
    percentageFormatter,
    loadMatches() {
      matchesQuery
        .where(
          new groq.ConditionBuilder("player._ref == $playerId").params({
            playerId: this.currentPlayer._id,
          })
        )
        .fetch<secretHitlerMatchPlayer[]>()
        .then((matches) => (this.matches = matches));
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
    stats(): SecretHitlerStats {
      return new SecretHitlerStats(this.matches, this.currentPlayer);
    },
    statistics(): { message: string; value: string | number }[] {
      const { matches, wonMatches, lostMatches, ratio } = this.stats;
      const { penaltyPoints, liberalMatches, hitlerMatches } = this.stats;
      const { fascistMatches } = this.stats;

      return [
        { message: "totale partite", value: matches.length },
        { message: "vittorie", value: wonMatches.length },
        { message: "sconfitte", value: lostMatches.length },
        { message: "vittorie", value: `${percentageFormatter(ratio)} %` },
        { message: "penalità", value: penaltyPoints.length },
        {
          message: "partite liberali",
          value: liberalMatches.length,
        },
        {
          message: "partite fasciste",
          value: fascistMatches.length,
        },
        {
          message: "partite hitler",
          value: hitlerMatches.length,
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