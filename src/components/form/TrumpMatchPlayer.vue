<template>
  <div class="border-4 border-blue-500 border-opacity-50 rounded-md m-2 p-4">
    <label v-show="label" class="mb-4"> {{ label }} </label>
    <user-autocomplete
      class="w-full"
      :excludedPlayers="excludedPlayers"
      v-model="match.player"
    />
    <div class="flex flex-row">
      <div class="m-2">
        <label> Vittoria</label>
        <input class="ml-2" type="checkbox" v-model="match.win" />
      </div>
      <div class="m-2">
        <label> Penalità </label>
        <input class="ml-2" type="checkbox" v-model="match.penaltyPoint" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { player, trumpMatchPlayer } from "@/types/sanity";
import { defineComponent, PropType } from "vue";
import UserAutocomplete from "./UserAutocomplete.vue";

export default defineComponent({
  name: "TrumpMatchPlayer",
  components: { UserAutocomplete },
  emits: ["update:modelValue"],
  props: {
    label: {
      type: String,
      default: () => null,
    },
    excludedPlayers: {
      type: Array as PropType<player[]>,
      default: () => [] as player[],
    },
  },
  data() {
    return {
      match: {
        player: {},
        win: false,
        penaltyPoint: false,
      } as trumpMatchPlayer,
    };
  },
  watch: {
    match: {
      handler() {
        this.$emit("update:modelValue", this.match);
      },
      deep: true,
    },
  },
  methods: {},
});
</script>