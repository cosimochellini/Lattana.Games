<template>
  <!-- This is an example component -->
  <div class="max-w-xl md:max-w-3xl px-4 py-4 mx-auto">
    <h2 class="font-semibold">Statistiche 📊</h2>
    <div
      class="sm:grid sm:grid-flow-row sm:gap-4 sm:grid-cols-3 md:grid-cols-5"
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
    <h3 class="font-semibold" v-show="topMates.length">Accoppiamenti</h3>

    <div
      class="sm:grid sm:grid-flow-row sm:gap-4 sm:grid-cols-1 md:grid-cols-2"
    >
      <div>
        <h3 class="font-medium">Migliori 👑</h3>

        <div
          class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded m-2"
          v-for="mate in topMates"
          :key="mate.player._id"
        >
          <div class="flex justify-evenly items-center">
            <img
              class="w-10 h-10 rounded-full"
              :src="urlFor(mate.player.player.profileImage).width(100)"
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
              {{ mate.ratio.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>
      <div>
        <h3 class="font-medium">Peggiori 👎</h3>

        <div
          class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded m-2"
          v-for="mate in worstMates"
          :key="mate.player._id"
        >
          <div class="flex justify-around items-center">
            <img
              class="w-10 h-10 rounded-full"
              :src="urlFor(mate.player.player.profileImage).width(100)"
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
              {{ mate.ratio.toLocaleString() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { urlFor } from "@/istances/sanity";
import { byNumber, byValue } from "sort-es";
import { getPlayer } from "@/services/authService";
import { sanityTypes } from "@/constants/roleConstants";
import { player, trumpMatchPlayer } from "@/types/sanity";
import { notificationService } from "@/services/notificationService";
import { Mate, TrumpStats } from "@/utils/classes/trumpMatch/trumpStats";
import { ConditionBuilder, QueryBuilder } from "@/utils/sanityQueryBuilder";

const playerQuery = new QueryBuilder(sanityTypes.player);

const matchesQuery = new QueryBuilder(sanityTypes.trumpMatchPlayer)
  .select("..., player ->, trumpMatch -> {..., players[] -> {...,player -> } }")
  .freeze();

export default defineComponent({
  data() {
    return {
      players: [] as player[],
      matches: [] as trumpMatchPlayer[],
      currentPlayer: getPlayer() as player,
    };
  },
  mounted() {
    playerQuery
      .fetch<player[]>()
      .then((players) => (this.players = players))
      .catch(notificationService.danger);

    this.loadMatches();
  },
  methods: {
    urlFor,
    loadMatches() {
      this.stats.wonMatches.length;
      matchesQuery
        .where(
          new ConditionBuilder("player._ref == $playerId").params({
            playerId: this.currentPlayer._id,
          })
        )
        .fetch<trumpMatchPlayer[]>()
        .then((matches) => (this.matches = matches));
    },
  },
  computed: {
    stats(): TrumpStats {
      return new TrumpStats(this.matches, this.currentPlayer);
    },
    statistics(): { message: string; value: string }[] {
      const { matches, wonMatches, lostMatches, ratio } = this.stats;
      const { penaltyPoints, callingMatches } = this.stats;

      return [
        { message: "totale partite", value: matches.length.toString() },
        { message: "vittorie", value: wonMatches.length.toString() },
        { message: "sconfitte", value: lostMatches.length.toString() },
        { message: "percentuale", value: `${(ratio * 100).toFixed(0)} %` },
        { message: "penalità", value: penaltyPoints.length.toString() },
        {
          message: "partite chiamate",
          value: callingMatches.length.toString(),
        },
      ];
    },
    topMates(): Mate[] {
      return this.stats.mates.slice(0, 3);
    },
    worstMates(): Mate[] {
      const { mates } = this.stats;
      return mates
        .slice(mates.length - 3, mates.length)
        .sort(byValue("ratio", byNumber()));
    },
  },
});
</script>

<style>
</style>