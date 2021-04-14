<template>
  <div class="base-card">
    <label v-show="label" class="mb-4"> {{ label }} </label>
    <user-autocomplete
      class="w-full"
      :excludedPlayers="excludedPlayers"
      v-model="match.player"
    />
    <!-- <label> Ruolo </label>
    <select v-model="match.role" class="w-full base-select">
      <option v-for="role in allRoles" :key="role" :value="role">
        {{ role }}
      </option>
    </select> -->
    <!-- <div class="flex flex-row place-content-around">
      <div class="m-2">
        <label> Vittoria</label>
        <input class="ml-2" type="checkbox" v-model="match.win" />
      </div>
      <div class="m-2">
        <label> Penalità </label>
        <input class="ml-2" type="checkbox" v-model="match.penaltyPoint" />
      </div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import UserAutocomplete from "./UserAutocomplete.vue";
import { player, secretHitlerMatchPlayer } from "@/types";
import { secretHitlerRole } from "@/constants/roleConstants";

export default defineComponent({
  name: "SecretHitlerMatchPlayer",
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
    modelValue: {
      type: Object as PropType<secretHitlerMatchPlayer>,
      required: true,
    },
  },
  data() {
    return {
      allRoles: secretHitlerRole,
      match: this.modelValue,
    };
  },
  mounted() {},
  watch: {
    match: {
      handler(match) {
        this.$emit("update:modelValue", match);
      },
      deep: true,
    },
    modelValue: {
      handler(model) {
        this.match = model;
      },
      deep: true,
    },
  },
  methods: {},
});
</script>