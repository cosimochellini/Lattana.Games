<template>
  <select v-model="selected" @change="emitChanges">
    <option disabled :value="{}">seleziona giocatore</option>
    <option v-for="player in fetchedPlayers" :key="player._id" :value="player">
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

const playerQuery = new QueryBuilder(sanityTypes.player)
  .select("nickname, profileImage, name, surname, _id")
  .orderBy(new OrderBuilder("name"))
  .freeze();

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
      selected: {} as player,
    };
  },
  mounted() {
    this.fetchPlayers();
  },
  methods: {
    fetchPlayers() {
      if (this.exactPlayers)
        return (this.fetchedPlayers = this.exactPlayers ?? []);

      const player = this.selected;

      playerQuery
        .where(
          new ConditionBuilder("_id in $excluded")
            .params({ excluded: this.excludedPlayers.map((x) => x._id) })
            .optional()
            .reverse()
        )
        .fetch<player[]>()
        .then((p) => (this.fetchedPlayers = player?._id ? [player, ...p] : p));
    },
    emitChanges() {
      this.$emit("update:modelValue", this.selected);
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
      this.selected =
        this.fetchedPlayers.find((p) => p._id === player._id) ?? ({} as player);
    },
  },
});
</script>