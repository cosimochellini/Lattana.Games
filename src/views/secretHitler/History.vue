<template>
  <div
    class="grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 lg:max-w-screen-2xl m-auto p-4"
  >
    <article v-for="match in matches" :key="match._id" class="base-card">
      <div>data : {{ dayFormatter(match.matchDate) }}</div>
      <div>partito vittorioso : {{ match.winningRole }}</div>
      <hr class="my-2" />
      <div class="flex flex-row items-center justify-around">
        Giocatori:
        <span v-for="p in match.players" :key="p._id" class="ml-1">
          <img
            :src="image(p.player.profileImage)"
            loading="lazy"
            class="rounded-full border-2"
            :class="borderColor(p.role)"
            :title="`${p.player.name} ${p.player.surname}`"
          />
        </span>
      </div>

      <hr class="my-2" />
      <div class="flex justify-items-center justify-around">
        <button
          class="px-2 py-1 shadow-md bg-red-200 rounded-md w-20"
          @click="deleteMatch(match)"
        >
          Delete
        </button>
        <button class="px-2 py-1 shadow-md bg-blue-200 rounded-md w-20">
          Edit
        </button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { urlFor } from "@/instances/sanity";
import { dayFormatter } from "@/utils/formatters";
import { secretHitlerMatch } from "@/types/sanity";
import { defineComponent, onMounted, ref } from "vue";
import { byRole } from "@/utils/sortables/secratHitlerSortables";
import { notificationService } from "@/services/notificationService";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { OrderBuilder, QueryBuilder } from "@/utils/sanityQueryBuilder";
import { sanityTypes, secretHitlerRole } from "@/constants/roleConstants";
import { secretHitlerService } from "@/services/games/secretHitlerService";

const matchesQuery = new QueryBuilder(sanityTypes.secretHitlerMatch)
  .select(`...,  players[] -> {..., player -> {name, surname, profileImage}}`)
  .orderBy(new OrderBuilder("matchDate", true));

export default defineComponent({
  setup() {
    const matches = ref<secretHitlerMatch[]>([]);

    const loadMatched = () => {
      matchesQuery
        .fetch<secretHitlerMatch[]>()
        .then((responseMatches) => {
          responseMatches.forEach((m) => m.players.sort(byRole));
          matches.value = responseMatches;
        })
        .catch(notificationService.danger);
    };

    const image = (img: SanityImageSource) => urlFor(img).width(60);

    const deleteMatch = (match: secretHitlerMatch) =>
      secretHitlerService
        .deleteExistingMatch(match)
        .then(() => notificationService.success("eliminazione eseguita"))
        .catch(notificationService.danger)
        .finally(loadMatched);

    onMounted(loadMatched);

    const borderColor = (role: secretHitlerRole) => {
      switch (role) {
        case secretHitlerRole.fascist:
          return "border-red-500";
        case secretHitlerRole.liberal:
          return "border-blue-500";
        case secretHitlerRole.hitler:
          return "border-black";
      }
    };
    return {
      matches,
      loadMatched,
      image,
      dayFormatter,
      deleteMatch,
      borderColor,
    };
  },
});
</script>
