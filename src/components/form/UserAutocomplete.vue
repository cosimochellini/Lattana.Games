<template>
  <div>
    <select v-model="selected" @change="emitChanges">
      <option disabled :value="null">seleziona giocatore</option>
      <option v-for="player in fetchedPlayers" :key="player.id" :value="player">
        {{ player.name }} {{ player.surname }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { nanoid } from "nanoid";
import { player } from "@/types/sanity";
import { defineComponent, PropType } from "vue";
import { sanityTypes } from "@/constants/roleConstants";

import {
  contains,
  QueryBuilder,
  ConditionBuilder,
} from "@/utils/sanityQueryBuilder";

export default defineComponent({
  name: "UserAutocomplete",
  props: {
    exclutedPlayers: {
      type: Array as PropType<player[]>,
      default: () => [] as player[],
    },
    value: {
      type: Object as PropType<player>,
      default: () => {},
    },
  },
  emits: ["input"],
  data() {
    return {
      uniqueListId: nanoid(),
      fetchedPlayers: [] as player[],
      search: "",
      selected: null as player | null,
    };
  },
  mounted() {
    this.fetchPlayers();
  },
  methods: {
    fetchPlayers() {
      new QueryBuilder(sanityTypes.player)
        .select("nickname, profileImage, name, surname, _id")
        .where(
          new ConditionBuilder("name match $search || surname match $search")
            .params({ search: contains(this.search) })
            .optional(),
          new ConditionBuilder("_id in $excluded")
            .params({ excluded: this.exclutedPlayers.map((x) => x._id) })
            .optional()
            .reverse()
        )
        .fetch<player[]>()
        .then((players) => (this.fetchedPlayers = players));
    },
    emitChanges() {
      console.log("input => UserAutocomplete", this.selected);

      this.$emit("input", this.selected);
    },
  },
  watch: {
    search() {
      this.fetchPlayers();
    },
    exclutedPlayers() {
      this.fetchPlayers();
    },
    value() {
      this.selected = { ...this.selected, ...this.value };
    },
  },
});
</script>

<style>
</style>