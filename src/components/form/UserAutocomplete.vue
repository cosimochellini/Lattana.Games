<template>
  <select v-model="selectedId" class="base-select">
    <option disabled :value="''" class="base-option">
      {{ $t("form.userSelect.placeholder") }}
    </option>
    <option
      v-for="player in fetchedPlayers"
      :key="player._id"
      :value="player._id"
      class="base-option"
    >
      {{ player.name }} {{ player.surname }}
    </option>
  </select>
</template>

<script lang="ts">
import { player } from "@/types";
import { user } from "@/services/user.service";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "UserAutocomplete",
  props: {
    excludedPlayers: {
      type: Array as PropType<player[]>,
      default: () => [] as player[],
    },
    modelValue: {
      type: Object as PropType<player>,
      default: () => ({} as player),
    },
    exactPlayers: {
      type: Array as PropType<player[]>,
      default: () => null,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      fetchedPlayers: [] as player[],
      selectedId: this.modelValue._id ?? "",
    };
  },
  mounted() {
    this.fetchPlayers();
  },
  methods: {
    async fetchPlayers() {
      const excluded = (this.excludedPlayers ?? [])
        .filter(({ _id }) => _id !== this.selectedId)
        .map(({ _id }) => _id);

      if (this.exactPlayers) {
        const filterFn = excluded.length
          ? (p: player) => !excluded.includes(p._id)
          : () => true;

        return (this.fetchedPlayers = this.exactPlayers.filter(filterFn));
      }

      return user
        .getUsersDropdown({ excluded })
        .then((p) => (this.fetchedPlayers = p));
    },
    emitChanges() {
      this.$emit(
        "update:modelValue",
        this.fetchedPlayers.find((p) => p._id === this.selectedId) ?? {}
      );
    },
  },
  watch: {
    excludedPlayers: {
      handler() {
        this.fetchPlayers();
      },
      deep: true,
    },
    exactPlayers: {
      handler() {
        this.fetchPlayers();
      },
      deep: true,
    },
    modelValue(player: player) {
      this.selectedId = player?._id;
    },
    selectedId() {
      this.emitChanges();
    },
  },
});
</script>