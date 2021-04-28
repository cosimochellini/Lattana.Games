<template>
  <div>
    <h3
      class="base-subtitle first-capitalize"
      v-t="game + '.titles.' + title"
    />

    <div
      class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded-2xl shadow-lg my-2"
      v-for="(mate, index) in mates"
      :key="mate.player._id"
    >
      <div
        class="grid grid-cols-5 items-center"
        @click="selectedMates.toggle(mate.player._id)"
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
            v-if="!selectedMates.has(mate.player._id)"
            class="rounded-xl px-2 py-1 font-semibold"
            :class="tailwind.shared.backgroundRatio(mate.ratio, !highBetter)"
          >
            {{ formatter.percentageFormatter(mate.ratio) }}
          </span>
          <span v-else>
            <span
              class="rounded-xl px-2 py-1 font-semibold"
              :class="tailwind.base.background(!highBetter)"
            >
              {{ formatter.smallNumberFormatter(mate.lose) }}
            </span>
            <span
              class="rounded-xl px-2 py-1 font-semibold ml-1"
              :class="tailwind.base.background(highBetter)"
            >
              {{ formatter.smallNumberFormatter(mate.win) }}
            </span>
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Toggle } from "@/utils";
import { image } from "@/instances/sanity";
import { formatter } from "@/utils/formatters";
import { defineComponent, PropType } from "vue";
import { Mate } from "@/utils/classes/stats/baseStats";
import { tailwind } from "@/services/tailwind.service";

export default defineComponent({
  name: "MateList",
  props: {
    mates: {
      type: Array as PropType<Mate[]>,
      required: true,
    },
    game: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    highBetter: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    formatter;
    return {
      tailwind,
      formatter,
      selectedMates: new Toggle(),
    };
  },
  methods: { image },
});
</script>
