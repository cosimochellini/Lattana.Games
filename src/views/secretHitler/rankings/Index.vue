<template>
  <div class="container">
    <label class="base-subtitle">Order by</label>
    <select class="base-select" v-model="selectedOrderby">
      <option v-for="option in orderby" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
    <div
      class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded m-2"
      v-for="{ profile, rank } in sortedRanks"
      :key="profile.nickname"
    >
      <div class="flex justify-evenly items-center">
        <img
          class="w-10 h-10 rounded-full"
          :src="image(profile.profileImage, 100)"
        />
        <span class="ml-2 text-gray-700 font-semibold font-sans tracking-wide">
          {{ profile.nickname }}
        </span>
        <span class="ml-4">
          <span class="rounded-xl px-2 py-1 font-semibold bg-blue-300">
            {{ percentageFormatter(rank.ratio) }} %
            {{ smallNumberFormatter(rank.win) }} W
            {{ smallNumberFormatter(rank.lost) }} L
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { image } from "@/instances/sanity";
import { byNumber, byValue } from "sort-es";
import { groq } from "@/utils/GroqQueryBuilder";
import { sanityTypes } from "@/constants/roleConstants";
import { notificationService } from "@/services/notificationService";
import { percentageFormatter, smallNumberFormatter } from "@/utils/formatters";
import {
  player,
  secretHitlerMatch,
  secretHitlerMatchPlayer,
} from "@/types/sanity";
import { sortable } from "node_modules/sort-es/lib/src/types/types";

const matchesQuery = new groq.QueryBuilder(sanityTypes.secretHitlerMatch)
  .select("..., players[] -> { player ->, ...}")
  .cached();

type rank = {
  win: number;
  lost: number;
  ratio: number;
};
type information = {
  profile: player;
  rank: rank;
};

const orderby = {
  win: "win",
  ratio: "ratio",
  lost: "lost",
};

export default defineComponent({
  name: "Ranking",
  data() {
    return {
      matches: [] as secretHitlerMatch[],
      selectedOrderby: orderby.win,
      orderby,
    };
  },
  methods: {
    image,
    percentageFormatter,
    smallNumberFormatter,
  },
  activated() {
    matchesQuery
      .fetch<secretHitlerMatch[]>()
      .then((matches) => (this.matches = matches))
      .catch(notificationService.warning);
  },
  computed: {
    ranking(): information[] {
      const ranks = [] as information[];

      for (const nickname of this.allPlayers) {
        const playerFn = (player: secretHitlerMatchPlayer) =>
          player.player.nickname === nickname;

        const profile = this.matches
          .find((m) => m.players.some(playerFn))
          ?.players.find(playerFn)?.player;

        const playerMatches = this.matches.filter((m) =>
          m.players.some(playerFn)
        );

        const win = playerMatches.filter((match) =>
          match.players.some((player) => playerFn(player) && player.win)
        ).length;

        const lost = playerMatches.length - win;

        const ratio = win / playerMatches.length;
        ranks.push({ rank: { win, lost, ratio }, profile: profile as player });
      }
      return ranks;
    },
    allPlayers(): string[] {
      return [
        ...new Set(
          this.matches.flatMap((x) => x.players.map((p) => p.player.nickname))
        ),
      ];
    },
    sortedRanks(): information[] {
      const sortable: sortable<information> =
        this.selectedOrderby === "win"
          ? byValue(({ rank }) => rank.win, byNumber({ desc: true }))
          : this.selectedOrderby === "ratio"
          ? byValue(({ rank }) => rank.ratio, byNumber({ desc: true }))
          : byValue(({ rank }) => rank.lost, byNumber({ desc: true }));

      return this.ranking.concat().sort(sortable);
    },
  },
});
</script>