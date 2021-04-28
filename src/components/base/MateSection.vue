<template>
  <div class="sm:grid sm:grid-flow-row sm:gap-4 sm:grid-cols-1 md:grid-cols-2">
    <mate-list
      :mates="best"
      :game="game"
      title="bestMatches"
      :highBetter="true"
    />
    <mate-list
      :mates="worst"
      :game="game"
      title="worstMatches"
      :highBetter="false"
    />
  </div>
</template>

<script lang="ts">
import MateList from "./MateList.vue";
import { defineComponent, PropType } from "vue";
import { Mate } from "@/utils/classes/stats/baseStats";

export default defineComponent({
  name: "MateSection",
  components: { MateList },
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
});
</script>
