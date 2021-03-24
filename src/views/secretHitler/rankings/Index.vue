<template>
  <div class="container text-center m-auto">
    <span class="base-title">Rankings</span>
    <div
      class="px-2 pt-2 flex items-center place-content-around max-w-2xl m-auto mb-3"
    >
      <label class="base-subtitle first-capitalize">
        {{ $t("form.orderBy.title") }}
      </label>
      <select class="base-select" v-model="selectedOrderby">
        <option v-for="option in allOrderBy" :key="option" :value="option">
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
      class="flex flex-col justify-center px-3 py-3 bg-white border border-gray-300 rounded-xl my-1 mx-2 max-w-2xl text-center lg:m-auto lg:mt-1"
      v-for="({ profile, rank }, index) in sortedRanks"
      :key="profile.nickname"
    >
      <div class="grid grid-cols-4 items-center text-center">
        <img
          class="w-10 h-10 rounded-full col-span-1 m-auto"
          :src="image(profile.profileImage, 500)"
          :class="bindImageRing(index)"
          :title="profile.name + ' ' + profile.surname"
        />
        <span class="col-span-2 m-auto">
          <span class="text-gray-700 font-semibold font-sans tracking-wide">
            {{ profile.name }}
            {{ profile.surname }}
          </span>
        </span>
        <span class="col-span-1 m-auto">
          <badge
            v-if="selectedOrderby !== allOrderBy.ratio"
            :background="bindBadgeColor(index)"
            :textColor="bindBadgeTextColor(index)"
            :text="smallNumberFormatter(rank[selectedOrderby])"
          />
          <badge
            v-else
            :background="bindBadgeColor(index)"
            :textColor="bindBadgeTextColor(index)"
            :text="percentageFormatter(rank[selectedOrderby]) + '%'"
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
import { secretHitlerMatch } from "@/types/sanity";
import { orderby, information } from "@/types/ranking";
import { secretHitlerMatchPlayer } from "@/types/sanity";
import { notification } from "@/services/notification.service";
import { orderbyDirection, secretHitlerOrderBy } from "@/types/ranking";
import { sanityTypes, secretHitlerRole } from "@/constants/roleConstants";
import { percentageFormatter, smallNumberFormatter } from "@/utils/formatters";

const matchesQuery = new groq.QueryBuilder(sanityTypes.secretHitlerMatch)
  .select("..., players[] -> { player ->, ...}")
  .cached();

const background = ["ring-yellow-400", "ring-gray-300", "ring-yellow-700"];

declare type secretHitlerInformation = {
  rank: {
    hitlerMatches: number;
    fascistMatches: number;
    liberalMatches: number;
  };
} & information;

const allOrderBy = { ...orderby, ...secretHitlerOrderBy };

const reverseOrderBy = [
  orderby.lost,
  allOrderBy.hitlerMatches,
  allOrderBy.fascistMatches,
];

export default defineComponent({
  components: { Badge },
  name: "Ranking",
  data() {
    return {
      allOrderBy,
      orderbyDirection,
      selectedOrderby: allOrderBy.win,
      matches: [] as secretHitlerMatch[],
      selectedOrderbyDirection: orderbyDirection.desc,
    };
  },
  methods: {
    image,
    percentageFormatter,
    smallNumberFormatter,
    bindRealIndex(index: number, considerReverse: boolean): number {
      const desc = this.selectedOrderbyDirection === orderbyDirection.desc;
      const reverse = reverseOrderBy.includes(this.selectedOrderby);
      const reversedIndex = this.sortedRanks.length - index - 1;

      return (considerReverse ? desc !== reverse : desc)
        ? index
        : reversedIndex;
    },
    bindImageRing(index: number): Dictionary<boolean> {
      const realIndex = this.bindRealIndex(index, false);
      if (realIndex >= 3) return {};

      return {
        ring: true,
        [background[realIndex]]: true,
      };
    },
    bindBadgeColor(index: number): string {
      const realIndex = this.bindRealIndex(index, true);

      const rate = realIndex / this.sortedRanks.length;

      if (rate < 0.16) return "bg-green-400";
      if (rate < 0.33) return "bg-green-300";
      if (rate < 0.5) return "bg-green-200";

      if (rate < 0.66) return "bg-red-200";
      if (rate < 0.83) return "bg-red-300";

      return "bg-red-400";
    },
    bindBadgeTextColor(index: number): string {
      const realIndex = this.bindRealIndex(index, true);

      return realIndex / this.sortedRanks.length < 0.5
        ? "text-green-800"
        : "text-red-800";
    },
  },
  activated() {
    matchesQuery
      .fetch<secretHitlerMatch[]>()
      .then((matches) => (this.matches = matches))
      .catch(notification.warning);
  },
  computed: {
    ranking(): secretHitlerInformation[] {
      const ranks = [] as secretHitlerInformation[];

      for (const nickname of this.allPlayers) {
        const playerFn = (player: secretHitlerMatchPlayer) =>
          player.player.nickname === nickname;

        const playerMatches = this.matches
          .map((match) => match.players.find(playerFn))
          .filter(Boolean) as secretHitlerMatchPlayer[];

        const profile = playerMatches[0].player;

        const win = playerMatches.filter((player) => player.win).length;

        const hitlerMatches = playerMatches.filter(
          (player) => player.role === secretHitlerRole.hitler
        ).length;

        const liberalMatches = playerMatches.filter(
          (player) => player.role === secretHitlerRole.liberal
        ).length;

        const fascitRoles = [secretHitlerRole.fascist, secretHitlerRole.hitler];
        const fascistMatches = playerMatches.filter((player) =>
          fascitRoles.includes(player.role)
        ).length;

        const lost = playerMatches.length - win;

        const ratio = win / playerMatches.length;

        const rank = {
          win,
          lost,
          ratio,
          hitlerMatches,
          liberalMatches,
          fascistMatches,
          totalMatches: playerMatches.length,
        };

        ranks.push({ rank, profile });
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
    sortedRanks(): secretHitlerInformation[] {
      const desc = this.selectedOrderbyDirection === orderbyDirection.desc;
      const type = this.selectedOrderby;

      return this.ranking
        .concat()
        .sort(byValue(({ rank }) => rank[type], byNumber({ desc })));
    },
  },
});
</script>