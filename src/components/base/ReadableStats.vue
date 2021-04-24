<template>
  <h2 class="base-title first-capitalize" v-t="game + '.titles.stats'" />

  <div
    class="grid grid-flow-row gap-3 md:gap-4 lg:gap-5 grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
  >
    <div
      class="flex flex-col justify-center bg-white rounded-xl shadow-lg"
      v-for="statistic in statistics"
      :key="statistic.display"
    >
      <div class="relative p-3">
        <span
          class="absolute top-0 right-0 m-1 inline-flex items-center justify-center px-2 py-1.5 text-xs font-bold leading-none rounded-full opacity-70"
          :class="
            selectedStatistics.has(statistic.display)
              ? 'bg-green-200'
              : 'bg-blue-200'
          "
          v-if="statistic.percentage"
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
            class="text-center text-gray-500"
            :class="dynamicText(statistic.display)"
            v-t="game + '.stats.' + statistic.display"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Toggle } from "@/utils";
import { formatter } from "@/utils/formatters";
import { defineComponent, PropType } from "vue";
import { ReadableStats } from "@/utils/classes/stats/baseStats";

export default defineComponent({
  name: "readableStats",
  props: {
    statistics: {
      type: Array as PropType<Array<ReadableStats<unknown>>>,
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
      selectedStatistics: new Toggle(),
    };
  },
  methods: {
    setTab(stat: ReadableStats<unknown>) {
      const hasPercentage = stat.percentage !== null;

      if (!hasPercentage) return;

      this.selectedStatistics.toggle(stat.display);
    },
    dynamicText(name: string) {
      const rawValue = this.$t(this.game + ".stats." + name);

      switch (true) {
        case rawValue.length < 16:
          return "text-lg";
        case rawValue.length > 16:
          return "text-md";
      }

      return "";
    },
  },
});
</script>
