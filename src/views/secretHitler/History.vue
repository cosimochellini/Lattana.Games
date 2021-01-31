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
        <div class="flex -space-x-1 overflow-hidden px-1">
          <img
            v-for="p in match.players"
            :key="p._id"
            :src="image(p.player.profileImage, 100)"
            :title="`${p.player.name} ${p.player.surname}`"
            :class="borderColor(p.role)"
            class="inline-block h-8 w-8 rounded-full ring-2 my-2"
            loading="lazy"
          />
        </div>
      </div>

      <hr class="my-2" />
      <div class="flex justify-items-center justify-around">
        <button
          class="px-2 py-1 shadow-md bg-red-200 rounded-md w-20"
          @click="deleteMatch(match)"
        >
          Delete
        </button>
        <button class="px-2 py-1 shadow-md bg-gray-200 rounded-md w-20">
          Edit
        </button>
        <button
          class="px-2 py-1 shadow-sm bg-blue-200 rounded-md w-20"
          @click="copyMatch(match)"
        >
          Copy
        </button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { image } from "@/instances/sanity";
import { dayFormatter } from "@/utils/formatters";
import { secretHitlerMatch } from "@/types/sanity";
import { defineComponent, onMounted, ref } from "vue";
import { overlayService } from "@/services/overlayService";
import { byRole } from "@/utils/sortables/secratHitlerSortables";
import { notificationService } from "@/services/notificationService";
import { OrderBuilder, QueryBuilder } from "@/utils/sanityQueryBuilder";
import { sanityTypes, secretHitlerRole } from "@/constants/roleConstants";
import { secretHitlerService } from "@/services/games/secretHitlerService";

const matchesQuery = new QueryBuilder(sanityTypes.secretHitlerMatch)
  .select(`...,  players[] -> {..., player -> {name, surname, profileImage}}`)
  .orderBy(new OrderBuilder("matchDate", true));

export default defineComponent({
  setup() {
    const matches = ref<secretHitlerMatch[]>([]);
    const router = useRouter();

    const loadMatched = () => {
      matchesQuery
        .fetch<secretHitlerMatch[]>()
        .then((responseMatches) => {
          responseMatches.forEach((m) => m.players.sort(byRole));
          matches.value = responseMatches;
        })
        .catch(notificationService.danger);
    };

    const deleteMatch = (match: secretHitlerMatch) =>
      overlayService.showOverlay() &&
      secretHitlerService
        .deleteExistingMatch(match)
        .then(() => notificationService.success("eliminazione eseguita"))
        .catch(notificationService.danger)
        .finally(() => overlayService.hideOverlay() && loadMatched());

    onMounted(loadMatched);

    const borderColor = (role: secretHitlerRole) => {
      switch (role) {
        case secretHitlerRole.fascist:
          return "ring-red-500";
        case secretHitlerRole.liberal:
          return "ring-blue-500";
        case secretHitlerRole.hitler:
          return "ring-black";
      }
    };

    const copyMatch = (match: secretHitlerMatch) =>
      router.push({ name: "secretHitlerNew", query: { ref: match._id } });

    return {
      image,
      matches,
      copyMatch,
      deleteMatch,
      loadMatched,
      borderColor,
      dayFormatter,
    };
  },
});
</script>
