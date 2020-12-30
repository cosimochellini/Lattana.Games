<template>
  <select v-model="selected" @change="emitChanges">
    <option disabled :value="{}">seleziona giocatore</option>
    <option v-for="player in fetchedPlayers" :key="player._id" :value="player">
      {{ player.name }} {{ player.surname }}
    </option>
  </select>
</template>

<script lang="ts">
import { nanoid } from "nanoid";
import { player } from "@/types/sanity";
import { defineComponent, PropType } from "vue";
import { sanityTypes } from "@/constants/roleConstants";

import { QueryBuilder, ConditionBuilder } from "@/utils/sanityQueryBuilder";

export default defineComponent({
  name: "UserAutocomplete",
  props: {
    exclutedPlayers: {
      type: Array as PropType<player[]>,
      default: () => [] as player[],
    },
    modelValue: {
      type: Object as PropType<player>,
      default: () => ({} as player),
    },
    exactPlayers: {
      type: Array as PropType<player[]>,
      defalut: () => null,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      uniqueListId: nanoid(),
      fetchedPlayers: [] as player[],
      selected: {} as player,
    };
  },
  mounted() {
    this.fetchPlayers();
  },
  methods: {
    fetchPlayers() {
      if (this.exactPlayers?.map)
        return (this.fetchedPlayers = this.exactPlayers);

      new QueryBuilder(sanityTypes.player)
        .select("nickname, profileImage, name, surname, _id")
        .where(
          //     new ConditionBuilder("name match $search || surname match $search")
          //       .params({ search: contains(this.search) })
          //       .optional(),
          new ConditionBuilder("_id in $excluded")
            .params({ excluded: this.exclutedPlayers.map((x) => x._id) })
            .optional()
            .reverse()
        )
        .fetch<player[]>()
        .then((players) => (this.fetchedPlayers = players));
    },
    emitChanges() {
      this.$emit("update:modelValue", this.selected);
    },
  },
  watch: {
    search() {
      this.fetchPlayers();
    },
    exclutedPlayers() {
      // nel caso il campo sia già calcolato
      if (!this.selected?._id) this.fetchPlayers();
    },
    exactPlayers() {
      this.fetchPlayers();
    },
  },
});
</script>

<style>
</style>