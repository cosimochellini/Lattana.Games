<template>
  <div>
    <trump-match-player
      v-for="(player, i) in currentMatch.players"
      :key="i"
      :modelValue="player"
    />
  </div>
</template>

<script lang="ts">
import { useRoute } from "vue-router";
import { defineComponent, onMounted, ref } from "vue";
import { trumpMatch } from "@/types/sanity";
import { sanityTypes } from "@/constants/roleConstants";

import {
  QueryBuilder,
  ConditionBuilder,
  PaginationBuilder,
} from "@/utils/sanityQueryBuilder";
import TrumpMatchPlayer from "@/components/form/TrumpMatchPlayer.vue";

const matchQuery = new QueryBuilder(sanityTypes.trumpMatch)
  .select("..., players[]-> {..., player ->}, createdBy ->, editedBy ->")
  .get(new PaginationBuilder().first())
  .freeze();

export default defineComponent({
  components: {
    TrumpMatchPlayer,
  },
  setup() {
    const route = useRoute();
    const currentMatch = ref({} as trumpMatch);

    onMounted(() =>
      matchQuery
        .where(
          new ConditionBuilder("_id == $id").params({ id: route.params.id })
        )
        .fetch<trumpMatch>()
        .then((match) => (currentMatch.value = match))
    );

    return {
      currentMatch,
    };
  },
});
</script>

<style>
</style>