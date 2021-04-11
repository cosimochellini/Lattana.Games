<template>
  <div class="container text-center m-auto">
    <span class="base-title">Rankings</span>
    <div
      class="px-2 pt-2 flex items-center place-content-around max-w-2xl m-auto mb-3"
    >
      <select class="base-select" v-model="selectedOrderby">
        <option v-for="option in allOrderBy" :key="option" :value="option">
          {{ $t("form.orderBy." + option) }}
        </option>
      </select>
      <select class="base-select" v-model="selectedShape">
        <option
          v-for="option in ['raw', 'percentage']"
          :key="option"
          :value="option"
        >
          <!-- {{ $t("form.orderBy." + option) }} -->
          {{ option }}
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
      v-for="(rank, index) in sortedRanks"
      :key="rank.profile.nickname"
    >
      <div class="grid grid-cols-4 items-center text-center">
        <img
          class="w-10 h-10 rounded-full col-span-1 m-auto"
          :src="image(rank.profile.profileImage, 500)"
          :class="bindImageRing(index)"
          :title="rank.profile.name + ' ' + rank.profile.surname"
        />
        <span class="col-span-2 m-auto">
          <span class="text-gray-700 font-semibold font-sans tracking-wide">
            {{ rank.profile.name }}
            {{ rank.profile.surname }}
          </span>
        </span>
        <span class="col-span-1 m-auto">
          <badge
            :background="bindBadgeColor(index)"
            :textColor="bindBadgeTextColor(index)"
            :text="bindBadgeText(rank)"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Dictionary } from "@/types";
import { defineComponent } from "vue";
import { orderby } from "@/types/ranking";
import { image } from "@/instances/sanity";
import { byNumber, byValue } from "sort-es";
import { formatter } from "@/utils/formatters";
import Badge from "@/components/base/Badge.vue";
import { tailwind } from "@/services/tailwind.service";
import { Rankable, RankingList } from "@/utils/classes/stats/ranks/baseRank";
import { secretHitler } from "@/services/games/secretHitler.service";
import { orderbyDirection, secretHitlerOrderBy } from "@/types/ranking";
import { secretHitlerRank } from "@/utils/classes/stats/ranks/secretHitlerRank";

const allOrderBy = { ...orderby, ...secretHitlerOrderBy };

export default defineComponent({
  components: { Badge },
  name: "Ranking",
  data() {
    return {
      formatter,
      allOrderBy,
      orderbyDirection,
      selectedOrderby: allOrderBy.win,
      selectedShape: "raw" as "raw" | "percentage",
      selectedOrderbyDirection: orderbyDirection.desc,
      ranking: RankingList.default(secretHitlerRank.create),
    };
  },
  methods: {
    image,
    bindRealIndex(index: number): number {
      const desc = this.selectedOrderbyDirection === orderbyDirection.desc;
      const reverse = !this.currentRank.higherBetter;
      const reversedIndex = this.sortedRanks.length - index - 1;

      return (reverse ? desc !== reverse : desc) ? index : reversedIndex;
    },
    bindImageRing(index: number): Dictionary<boolean> {
      const realIndex = this.bindRealIndex(index);
      if (realIndex >= 3) return {};

      return {
        ring: true,
        [tailwind.shared.rankingBackground[realIndex]]: true,
      };
    },
    bindBadgeColor(index: number): string {
      const realIndex = this.bindRealIndex(index);

      const rate = realIndex / this.sortedRanks.length;

      return tailwind.shared.bindRate(rate);
    },
    bindBadgeTextColor(index: number): string {
      const realIndex = this.bindRealIndex(index);

      return tailwind.base.text(realIndex / this.sortedRanks.length < 0.5);
    },
    bindBadgeText(rank: secretHitlerRank) {
      const value = rank[this.selectedOrderby][this.selectedShape];

      return this.selectedShape === "percentage"
        ? formatter.percentageFormatter(value) + " %"
        : formatter.smallNumberFormatter(value);
    },
  },
  activated() {
    secretHitler.getRanking().then((rank) => (this.ranking = rank));
  },
  computed: {
    sortedRanks(): secretHitlerRank[] {
      const desc = this.selectedOrderbyDirection === orderbyDirection.desc;
      const type = this.selectedOrderby;
      const shape = this.selectedShape;

      return this.ranking
        .toList()
        .sort(byValue((rank) => rank[type][shape], byNumber({ desc })));
    },
    currentRank(): Rankable {
      return this.sortedRanks[0][this.selectedOrderby];
    },
  },
});
</script>