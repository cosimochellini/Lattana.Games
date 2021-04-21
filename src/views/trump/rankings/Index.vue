<template>
  <div class="container text-center m-auto">
    <h2 class="base-title first-capitalize" v-t="'trump.titles.ranking'" />

    <div
      class="pt-2 flex items-center place-content-around max-w-2xl mb-3 m-auto"
    >
      <select class="base-select" v-model="selectedOrderby">
        <option
          v-for="option in allOrderBy"
          :key="option"
          :value="option"
          v-t="'form.orderBy.' + option"
        />
      </select>
      <select class="base-select" v-model="selectedShape">
        <option
          v-for="option in orderByShape"
          :key="option"
          :value="option"
          v-t="'form.base.shapeOptions.' + option"
        />
      </select>
      <select class="base-select" v-model="selectedOrderbyDirection">
        <option
          v-for="option in orderbyDirection"
          :key="option"
          :value="option"
          v-t="'form.orderBy.' + option"
        />
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
import { image } from "@/instances/sanity";
import { byNumber, byValue } from "sort-es";
import { formatter } from "@/utils/formatters";
import Badge from "@/components/base/Badge.vue";
import { trump } from "@/services/games/trump.service";
import { tailwind } from "@/services/tailwind.service";
import { orderby, orderByShape } from "@/types/ranking";
import { orderbyDirection, trumpOrderBy } from "@/types/ranking";
import { trumpRank } from "@/utils/classes/stats/ranks/trumpRank";
import { Rankable, RankingList } from "@/utils/classes/stats/ranks/baseRank";

const allOrderBy = { ...orderby, ...trumpOrderBy };
export default defineComponent({
  components: { Badge },
  name: "Ranking",
  data() {
    return {
      formatter,
      allOrderBy,
      orderByShape,
      orderbyDirection,
      selectedOrderby: allOrderBy.win,
      selectedShape: orderByShape.raw,
      ranking: RankingList.default(trumpRank.create),
      selectedOrderbyDirection: orderbyDirection.desc,
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
      return tailwind.shared.bindImageRing(this.bindRealIndex(index));
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
    bindBadgeText(rank: trumpRank) {
      const value = rank[this.selectedOrderby][this.selectedShape];

      return this.selectedShape === orderByShape.percentage
        ? formatter.percentageFormatter(value)
        : formatter.smallNumberFormatter(value);
    },
  },
  activated() {
    trump.getRanking().then((rank) => (this.ranking = rank));
  },
  computed: {
    sortedRanks(): trumpRank[] {
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