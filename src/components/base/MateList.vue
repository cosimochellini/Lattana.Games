<template>
  <div class="sm:grid sm:grid-flow-row sm:gap-4 sm:grid-cols-1 md:grid-cols-2">
    <div>
      <h3
        class="base-subtitle first-capitalize"
        v-t="'trump.titles.bestMatches'"
      />

      <div
        class="flex flex-col justify-center p-4 bg-white rounded-2xl shadow-lg my-2"
        v-for="(mate, index) in best"
        :key="mate.player._id"
      >
        <div
          class="grid grid-cols-5 items-center"
          @click="toggleSelected(mate.player._id, 'bestMateSelected')"
        >
          <span class="col-span-1 text-center m-auto">
            <img
              class="w-10 h-10 rounded-full"
              :src="image(mate.player.profileImage, 500)"
              :class="tailwind.shared.bindImageRing(index)"
            />
          </span>
          <span
            class="col-span-3 text-gray-700 font-semibold font-sans tracking-wide text-center"
          >
            {{ mate.player.name }}
            {{ mate.player.surname }}
          </span>
          <span class="col-span-1 text-center tracking-widest">
            <span
              v-if="!bestMateSelected.has(mate.player._id)"
              class="rounded-xl px-2 py-1 font-semibold"
              :class="tailwind.shared.backgroundRatio(mate.ratio)"
            >
              {{ formatter.percentageFormatter(mate.ratio) }}
            </span>
            <span v-if="bestMateSelected.has(mate.player._id)">
              <span
                class="rounded-xl px-2 py-1 font-semibold"
                :class="tailwind.base.background(true)"
              >
                {{ formatter.smallNumberFormatter(mate.win) }}
              </span>
              <span
                class="rounded-xl px-2 py-1 font-semibold ml-2"
                :class="tailwind.base.background(false)"
              >
                {{ formatter.smallNumberFormatter(mate.lose) }}
              </span>
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
        class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded-2xl shadow-lg my-2"
        v-for="(mate, index) in worst"
        :key="mate.player._id"
      >
        <div
          class="grid grid-cols-5 items-center"
          @click="toggleSelected(mate.player._id, 'worstMateSelected')"
        >
          <span class="col-span-1 text-center m-auto">
            <img
              class="w-10 h-10 rounded-full"
              :src="image(mate.player.profileImage, 500)"
              :class="tailwind.shared.bindImageRing(index)"
            />
          </span>
          <span
            class="col-span-3 text-gray-700 font-semibold font-sans tracking-wide text-center"
          >
            {{ mate.player.name }}
            {{ mate.player.surname }}
          </span>
          <span class="col-span-1 text-center tracking-widest">
            <span
              v-if="!worstMateSelected.has(mate.player._id)"
              class="rounded-xl px-2 py-1 font-semibold"
              :class="tailwind.shared.backgroundRatio(mate.ratio, true)"
            >
              {{ formatter.percentageFormatter(mate.ratio) }}
            </span>
            <span v-if="worstMateSelected.has(mate.player._id)">
              <span
                class="rounded-xl px-2 py-1 font-semibold"
                :class="tailwind.base.background(true)"
              >
                {{ formatter.smallNumberFormatter(mate.lose) }}
              </span>
              <span
                class="rounded-xl px-2 py-1 font-semibold ml-2"
                :class="tailwind.base.background(false)"
              >
                {{ formatter.smallNumberFormatter(mate.win) }}
              </span>
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

      bestMateSelected: new Set<string>(),
      worstMateSelected: new Set<string>(),
    };
  },
  methods: {
    image,
    toggleSelected(
      playerId: string,
      ref: "bestMateSelected" | "worstMateSelected"
    ) {
      this[ref].has(playerId)
        ? this[ref].delete(playerId)
        : this[ref].add(playerId);
    },
  },
});
</script>
