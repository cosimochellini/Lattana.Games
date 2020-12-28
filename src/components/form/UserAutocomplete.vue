<template>
  <div>
    <input
      class="p-1 w-80"
      v-model="search"
      :list="uniqueListId"
      type="text"
      @input="emitPlayer"
    />

    <datalist :id="uniqueListId">
      <option v-for="player in fetchedPlayers" :key="player.id">
        {{ player.name }} {{ player.surname }}
      </option>
    </datalist>
  </div>
</template>

<script lang="ts">
import { nanoid } from "nanoid";
import { player } from "@/types/sanity";
import { defineComponent, PropType } from "vue";
import { sanityTypes } from "@/constants/roleConstants";

import {
  ConditionBuilder,
  contains,
  QueryBuilder,
} from "@/utils/sanityQueryBuilder";

export default defineComponent({
  name: "UserAutocomplete",
  props: {
    exclutedPlayers: {
      type: Array as PropType<player[]>,
      default: () => [] as player[],
    },
  },
  emits: ["input"],
  data() {
    return {
      uniqueListId: nanoid(),
      fetchedPlayers: [] as player[],
      search: "",
    };
  },
  mounted() {
    this.fetchPlayers();
  },
  methods: {
    fetchPlayers() {
      new QueryBuilder()
        .type(sanityTypes.player)
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
    emitPlayer() {
      const selected = this.fetchedPlayers.find(
        (p) => `${p.name} ${p.surname}` === this.search
      );
      this.$emit("input", selected);
    },
  },
  watch: {
    search() {
      this.fetchPlayers();
    },
    exclutedPlayers() {
      this.fetchPlayers();
    },
  },
});
</script>

<style>
</style>