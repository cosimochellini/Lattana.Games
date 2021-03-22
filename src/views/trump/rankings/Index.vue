<template>
  <div class="container">
    <div class="px-2 pt-2 flex items-center place-content-around">
      <label class="base-subtitle first-capitalize">
        {{ $t("form.orderBy.title") }}
      </label>
      <select class="base-select" v-model="selectedOrderby">
        <option v-for="option in orderby" :key="option" :value="option">
          {{ $t("form.orderBy." + option) }}
        </option>
      </select>
      <select class="base-select" v-model="selectedOrderbyDirection">
        <option
          v-for="option in orderbyDirection"
          :key="option"
          :value="option"
        >
          {{ $t("form.orderBy." + option) }}
        </option>
      </select>
    </div>
    <div
      class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded-md m-2"
      v-for="({ profile, rank }, index) in sortedRanks"
      :key="profile.nickname"
    >
      <div class="grid grid-cols-4 items-center text-center">
        <img
          class="w-10 h-10 rounded-full col-span-1 m-auto"
          :src="image(profile.profileImage, 500)"
          :class="bindImageRing(index)"
        />
        <span class="col-span-2 m-auto">
          <span class="text-gray-700 font-semibold font-sans tracking-wide">
            {{ profile.name }}
            {{ profile.surname }}
          </span>
        </span>
        <span class="col-span-1 m-auto">
          <!-- <span class="rounded-xl px-2 py-1 font-semibold bg-blue-300"> -->
          <badge
            v-if="selectedOrderby === orderby.win"
            :background="bindBadgeColor(index)"
            :textColor="bindBadgeTextColor(index)"
            :text="smallNumberFormatter(rank.win)"
          />
          <badge
            v-else-if="selectedOrderby === orderby.ratio"
            :background="bindBadgeColor(index)"
            :textColor="bindBadgeTextColor(index)"
            :text="percentageFormatter(rank.ratio) + '%'"
          />

          <badge
            v-else
            :background="bindBadgeColor(index)"
            :text="smallNumberFormatter(rank.lost)"
            :textColor="bindBadgeTextColor(index)"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Dictionary } from "@/types/base";
import { image } from "@/instances/sanity";
import { byNumber, byValue } from "sort-es";
import Badge from "@/components/base/Badge.vue";
import { groq } from "@/utils/GroqQueryBuilder";
import { sortable } from "sort-es/lib/src/types/types";
import { sanityTypes } from "@/constants/roleConstants";
import { player } from "@/types/sanity";
import { trumpMatch, trumpMatchPlayer } from "@/types/sanity";
import { notificationService } from "@/services/notificationService";
import { information, orderby, orderbyDirection } from "@/types/ranking";
import { percentageFormatter, smallNumberFormatter } from "@/utils/formatters";

const matchesQuery = new groq.QueryBuilder(sanityTypes.trumpMatch)
  .select("..., players[] -> { player ->, ...}")
  .cached();

const background = ["ring-yellow-400", "ring-gray-300", "ring-yellow-700"];

export default defineComponent({
  components: { Badge },
  name: "Ranking",
  data() {
    return {
      orderby,
      orderbyDirection,
      selectedOrderby: orderby.win,
      matches: [] as trumpMatch[],
      selectedOrderbyDirection: orderbyDirection.desc,
    };
  },
  methods: {
    image,
    percentageFormatter,
    smallNumberFormatter,
    bindImageRing(index: number): Dictionary<boolean> {
      const realIndex =
        this.selectedOrderbyDirection === orderbyDirection.desc
          ? index
          : this.sortedRanks.length - index - 1;

      if (realIndex >= 3) return {};

      return {
        ring: true,
        [background[realIndex]]: true,
      };
    },
    bindBadgeColor(index: number): string {
      const realIndex =
        this.selectedOrderbyDirection === orderbyDirection.desc
          ? index
          : this.sortedRanks.length - index - 1;

      const rate = realIndex / this.sortedRanks.length;

      if (rate < 0.16) return "bg-green-400";
      if (rate < 0.33) return "bg-green-300";
      if (rate < 0.5) return "bg-green-200";

      if (rate < 0.66) return "bg-red-200";
      if (rate < 0.83) return "bg-red-300";

      return "bg-red-400";
    },
    bindBadgeTextColor(index: number): string {
      const realIndex =
        this.selectedOrderbyDirection === orderbyDirection.desc
          ? index
          : this.sortedRanks.length - index - 1;

      return realIndex / this.sortedRanks.length < 0.5
        ? "text-green-800"
        : "text-red-800";
    },
  },
  activated() {
    matchesQuery
      .fetch<trumpMatch[]>()
      .then((matches) => (this.matches = matches))
      .catch(notificationService.warning);
  },
  computed: {
    ranking(): information[] {
      const ranks = [] as information[];

      for (const nickname of this.allPlayers) {
        const playerFn = (player: trumpMatchPlayer) =>
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
      const desc = this.selectedOrderbyDirection === orderbyDirection.desc;
      const sortable: sortable<information> =
        this.selectedOrderby === orderby.win
          ? byValue(({ rank }) => rank.win, byNumber({ desc }))
          : this.selectedOrderby === orderby.ratio
          ? byValue(({ rank }) => rank.ratio, byNumber({ desc }))
          : byValue(({ rank }) => rank.lost, byNumber({ desc }));

      return this.ranking.concat().sort(sortable);
    },
  },
});
</script>