<template>
  <div class="sm:grid sm:grid-flow-row sm:gap-4 sm:grid-cols-1 md:grid-cols-2">
    <div>
      <h3
        class="base-subtitle first-capitalize"
        v-t="'trump.titles.bestMatches'"
      />

      <div
        class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded m-2"
        v-for="(mate, index) in best"
        :key="mate.player._id"
      >
        <div class="grid grid-cols-4 items-center">
          <span class="col-span-1 text-center m-auto">
            <img
              class="w-10 h-10 rounded-full"
              :src="image(mate.player.profileImage, 500)"
              :class="tailwind.shared.bindImageRing(index)"
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
              {{ formatter.percentageFormatter(mate.ratio) }}
            </span>
          </span>
        </div>
      </div>
    </div>
    <div>
      <h3
        class="base-subtitle first-capitalize"
        v-t="'trump.titles.worstEnemies'"
      />

      <div
        class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded m-2"
        v-for="(mate, index) in worst"
        :key="mate.player._id"
      >
        <div class="grid grid-cols-4 items-center">
          <span class="col-span-1 text-center m-auto">
            <img
              class="w-10 h-10 rounded-full"
              :src="image(mate.player.profileImage, 500)"
              :class="tailwind.shared.bindImageRing(index)"
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
              {{ formatter.percentageFormatter(mate.ratio) }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { image } from "@/instances/sanity";
import { formatter } from "@/utils/formatters";
import { defineComponent, PropType } from "vue";
import { Mate } from "@/utils/classes/stats/baseStats";
import { tailwind } from "@/services/tailwind.service";
export default defineComponent({
  name: "MateList",
  props: {
    best: {
      type: Array as PropType<Mate[]>,
      required: true,
    },
    worst: {
      type: Array as PropType<Mate[]>,
      required: true,
    },
    game: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tailwind,
      formatter,
    };
  },
  methods: {
    image,
  },
});
</script>
