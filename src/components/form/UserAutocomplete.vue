<template>
  <div class="m-1">
    <label v-show="label" :for="uniqueInputId"> {{ label }} </label>
    <input
      class="block p-1"
      v-model="search"
      :id="uniqueInputId"
      :name="label"
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
import { player } from "@/types/sanity";
import { defineComponent, PropType } from "vue";
import { sanityClient } from "@/istances/sanity";
import { playersAutocomplete } from "@/constants/groq/players";
import { contains, empty } from "@/utils/sanityQueryBuilder";

export default defineComponent({
  name: "UserAutocomplete",
  props: {
    label: {
      type: String,
      default: () => null,
    },
    exclutedPlayers: {
      type: Array as PropType<player[]>,
      default: () => [] as player[],
    },
  },
  emits: ["select"],
  data() {
    return {
      uniqueInputId: Math.random().toString(36).substring(7),
      uniqueListId: Math.random().toString(36).substring(7),
      fetchedPlayers: [] as player[],
      search: "",
    };
  },
  mounted() {
    this.fetchPlayers();
  },
  methods: {
    fetchPlayers() {
      sanityClient
        .fetch<player[]>(playersAutocomplete, {
          search: contains(this.search),
          excluded: empty(this.exclutedPlayers.map((x) => x._id)),
        })
        .then((players) => (this.fetchedPlayers = players));
    },
    emitPlayer() {
      const selected = this.fetchedPlayers.find(
        (p) => `${p.name} ${p.surname}` === this.search
      );

      this.$emit("select", selected);
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