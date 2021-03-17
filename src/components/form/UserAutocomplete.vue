<template>
  <!-- <select v-model="selectedId" class="base-select">
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
  </select> -->
  <Multiselect
    v-model="selectedId"
    class="base-multi-select"
    :searchable="true"
    :options="availableOptions"
    :placeholder="$t('form.userSelect.placeholder')"
  ></Multiselect>
</template>

<script lang="ts">
import { player } from "@/types/sanity";
import Multiselect from "@vueform/multiselect";
import { defineComponent, PropType } from "vue";
import { groq } from "@/utils/GroqQueryBuilder";
import { sanityTypes } from "@/constants/roleConstants";
import { multiSelectOption } from "@/types/multiselect";

const playerQuery = new groq.QueryBuilder(sanityTypes.player)
  .orderBy(new groq.OrderBuilder("name"))
  .cached();

export default defineComponent({
  name: "UserAutocomplete",
  components: {
    Multiselect,
  },
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
      playerQuery,
    };
  },
  mounted() {
    this.getPlayers();
  },
  methods: {
    getPlayers() {
      if (this.exactPlayers)
        return (this.fetchedPlayers = this.exactPlayers ?? []);

      this.playerQuery.fetch<player[]>().then((p) => (this.fetchedPlayers = p));
    },
    emitChanges() {
      this.$emit(
        "update:modelValue",
        this.fetchedPlayers.find((p) => p._id === this.selectedId) ?? {}
      );
    },
  },
  watch: {
    exactPlayers() {
      this.getPlayers();
    },
    modelValue(player: player) {
      this.selectedId = player?._id;
    },
    selectedId() {
      this.emitChanges();
    },
  },
  computed: {
    availableOptions(): multiSelectOption<string>[] {
      const expludedId = this.excludedPlayers
        .filter(({ _id }) => _id !== this.selectedId)
        .map(({ _id }) => _id);

      return this.fetchedPlayers
        .filter((p) => !expludedId.includes(p._id))
        .map((p) => {
          return {
            label: p.name + " " + p.surname,
            value: p._id,
          } as multiSelectOption<string>;
        });
    },
  },
});
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
