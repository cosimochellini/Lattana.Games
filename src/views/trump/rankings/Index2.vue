<template>
  <div class="container">
    <span class="base-title">rankings</span>
    <select v-model="selectedRanking" class="base-select">
      <option v-for="ranking in rankings" :key="ranking">{{ ranking }}</option>
    </select>
    <div class="container m-auto text-center">
      <component
        :is="selectedRanking"
        :matches="matches"
        class="container m-auto"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { trumpMatch } from "@/types/sanity";
import { groq } from "@/utils/GroqQueryBuilder";
import { sanityTypes } from "@/constants/roleConstants";
import { defineAsyncComponent, defineComponent } from "vue";
import { notification } from "@/services/notification.service";

const matchesQuery = new groq.QueryBuilder(sanityTypes.trumpMatch)
  .select("..., players[] -> { player ->, ...}")
  .cached();

export default defineComponent({
  name: "ranking",
  components: {
    total: defineAsyncComponent(
      () => import("@/views/trump/rankings/Total.vue")
    ),
  },
  data() {
    return {
      matches: [] as trumpMatch[],
      rankings: ["total", "something"],
      selectedRanking: "total",
    };
  },
  activated() {
    matchesQuery
      .fetch<trumpMatch[]>()
      .then((matches) => (this.matches = matches))
      .catch(notification.warning);
  },
});
</script>

