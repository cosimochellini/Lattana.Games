<template>
  <div
    class="flex flex-col justify-center p-3 bg-white rounded-2xl shadow-lg m-2 lg:my-3 max-w-2xl text-center lg:m-auto lg:mt-1"
    v-for="(rank, index) in rankingList"
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
          class="text-base tracking-wide rounded-md"
          :background="bindBadgeColor(index)"
          :textColor="bindBadgeTextColor(index)"
          :text="bindBadgeText(rank)"
        />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Badge from "./Badge.vue";
import { Dictionary } from "@/types";
import { image } from "@/instances/sanity";
import { formatter } from "@/utils/formatters";
import { defineComponent, PropType } from "vue";
import { tailwind } from "@/services/tailwind.service";
import { orderbyDirection, orderByShape } from "@/types/ranking";
import { BaseRank, Rankable } from "@/utils/classes/stats/ranks/baseRank";

export default defineComponent({
  components: { Badge },
  name: "rankingUser",
  props: {
    rankingList: {
      type: Array as PropType<BaseRank<any, any>[]>,
      required: true,
    },
    orderby: {
      type: String,
      required: true,
    },
    shape: {
      type: String,
      required: true,
    },
  },
  methods: {
    image,
    bindRealIndex(index: number): number {
      const desc = this.orderby === orderbyDirection.desc;
      const reverse = this.currentRank.higherBetter;
      const reversedIndex = this.rankingList.length - index - 1;

      return (reverse ? desc !== reverse : desc) ? index : reversedIndex;
    },

    bindImageRing(index: number): Dictionary<boolean> {
      return tailwind.shared.bindImageRing(this.bindRealIndex(index));
    },

    bindBadgeColor(index: number): string {
      const realIndex = this.bindRealIndex(index);

      const rate = realIndex / this.rankingList.length;

      return tailwind.shared.bindRate(rate);
    },
    bindBadgeTextColor(index: number): string {
      const realIndex = this.bindRealIndex(index);

      return tailwind.base.text(realIndex / this.rankingList.length < 0.5);
    },
    bindBadgeText(rank: BaseRank<any, any>) {
      const value = (rank as any)[this.orderby][this.shape] as number;

      return this.shape === orderByShape.percentage
        ? formatter.percentageFormatter(value)
        : formatter.smallNumberFormatter(value);
    },
  },
  computed: {
    currentRank(): Rankable {
      return (this.rankingList[0] as any)[this.orderby];
    },
  },
});
</script>
