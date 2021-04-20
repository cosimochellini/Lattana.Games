<template>
  <div class="max-w-xl md:max-w-4xl px-4 py-4 mx-auto">
    <div class="my-4">
      <h2
        class="base-subtitle first-capitalize"
        v-t="'secretHitler.form.currentPlayer'"
      />

      <user-autocomplete
        v-model="currentPlayer"
        :exactPlayers="availablePlayers"
        class="block px-2 py-1"
      />
    </div>

    <stats-list :statistics="statistics" :game="'secretHitler'" />

    <div
      class="sm:grid sm:grid-flow-row sm:gap-4 sm:grid-cols-1 md:grid-cols-2"
    >
      <div>
        <h3
          class="base-subtitle first-capitalize mt-2"
          v-t="'secretHitler.titles.bestMatches'"
        />

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
        <h3
          class="base-subtitle first-capitalize mt-2"
          v-t="'secretHitler.titles.worstEnemies'"
        />

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
import { defineComponent } from "vue";
import { image } from "@/instances/sanity";
import { formatter } from "@/utils/formatters";
import { auth } from "@/services/auth.service";
import { user } from "@/services/user.service";
import { tailwind } from "@/services/tailwind.service";
import { player, secretHitlerMatchPlayer } from "@/types";
import StatsList from "@/components/base/ReadableStats.vue";
import { Mate, ReadableStats } from "@/utils/classes/stats/baseStats";
import { secretHitler } from "@/services/games/secretHitler.service";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";
import { SecretHitlerStats } from "@/utils/classes/stats/secretHitlerMatchStats";

export default defineComponent({
  components: { UserAutocomplete, StatsList },
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
    statistics(): ReadableStats<secretHitlerMatchPlayer>[] {
      return this.stats.GetReadableStats();
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