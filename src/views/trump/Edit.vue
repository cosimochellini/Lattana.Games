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
import { trumpMatch } from "@/types";
import { useRoute } from "vue-router";
import { groq } from "@/utils/GroqQueryBuilder";
import { defineComponent, onMounted, ref } from "vue";
import { sanityTypes } from "@/constants";
import TrumpMatchPlayer from "@/components/form/TrumpMatchPlayer.vue";

const matchQuery = new groq.QueryBuilder(sanityTypes.trumpMatch)
  .select("..., players[]-> {..., player ->}, createdBy ->, editedBy ->")
  .get(new groq.PaginationBuilder().first());

export default defineComponent({
  components: {
    TrumpMatchPlayer,
  },
  name: "trumpMatchEdit",
  setup() {
    const route = useRoute();
    const currentMatch = ref({} as trumpMatch);

    onMounted(() =>
      matchQuery
        .where(
          new groq.ConditionBuilder("_id == $id").params({
            id: route.params.id,
          })
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
