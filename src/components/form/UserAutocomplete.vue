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
import { player } from "@/types/sanity";
import { defineComponent, PropType } from "vue";
import { sanityTypes } from "@/constants/roleConstants";

import {
  QueryBuilder,
  OrderBuilder,
  ConditionBuilder,
} from "@/utils/sanityQueryBuilder";

// const playerQuery =

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
      playerQuery: new QueryBuilder(sanityTypes.player)
        .orderBy(new OrderBuilder("name"))
        .cached(),
    };
  },
  mounted() {
    this.fetchPlayers();
  },
  methods: {
    fetchPlayers() {
      if (this.exactPlayers)
        return (this.fetchedPlayers = this.exactPlayers ?? []);

      const excluded = this.excludedPlayers
        .filter(({ _id }) => _id !== this.selectedId)
        .map(({ _id }) => _id);

      this.playerQuery
        .where(
          new ConditionBuilder("_id in $excluded")
            .params({ excluded })
            .optional()
            .reverse()
        )
        .fetch<player[]>()
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
    search() {
      this.fetchPlayers();
    },
    excludedPlayers() {
      this.fetchPlayers();
    },
    exactPlayers() {
      this.fetchPlayers();
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