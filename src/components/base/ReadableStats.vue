<template>
  <h2 class="base-title first-capitalize" v-t="game + '.titles.stats'" />

  <div
    class="grid grid-flow-row gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
  >
    <div
      class="flex flex-col justify-center bg-white rounded-xl shadow-lg"
      v-for="statistic in statistics"
      :key="statistic.display"
    >
      <div class="relative px-4 py-4">
        <span
          class="absolute top-0 right-0 m-1 inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none rounded-full"
          :class="
            selectedStatistics.has(statistic.display)
              ? 'bg-green-300'
              : 'bg-blue-300'
          "
        >
          <i
            class="fas"
            :class="
              selectedStatistics.has(statistic.display)
                ? 'fa-percentage'
                : 'fa-value-absolute'
            "
          />
        </span>

        <div @click="setTab(statistic)">
          <p
            v-if="!selectedStatistics.has(statistic.display)"
            v-text="formatter.smallestNumberFormatter(statistic.raw)"
            class="text-3xl font-semibold text-center text-gray-800 tracking-wider"
          />
          <p
            v-else
            v-text="formatter.percentageFormatter(statistic.percentage ?? 0)"
            class="text-3xl font-semibold text-center text-gray-800 tracking-wider"
          />
          <p
            class="text-lg text-center text-gray-500"
            v-t="game + '.stats.' + statistic.display"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { formatter } from "@/utils/formatters";
import { defineComponent, PropType } from "vue";
import { ReadableStats } from "@/utils/classes/stats/baseStats";

export default defineComponent({
  name: "readableStats",
  props: {
    statistics: {
      type: Array as PropType<ReadableStats<unknown>[]>,
      required: true,
    },
    game: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formatter,
      selectedStatistics: new Set<string>(),
    };
  },
  methods: {
    setTab(stat: ReadableStats<unknown>) {
      const hasPercentage = stat.percentage !== null;
      const isClicked = this.selectedStatistics.has(stat.display);

      if (!hasPercentage) return;

      isClicked
        ? this.selectedStatistics.delete(stat.display)
        : this.selectedStatistics.add(stat.display);
    },
  },
});
</script>
