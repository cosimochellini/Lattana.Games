<template>
  <h2 class="base-title history-container">
    <span class="first-capitalize">
      {{ $t("secretHitler.titles.recentMatches") }}
    </span>
  </h2>
  <div class="history-container">
    <article v-for="match in items" :key="match._id" class="base-card">
      <div class="grid grid-cols-3">
        <span class="first-capitalize">
          {{ $t("secretHitler.form.matchDate") }}
        </span>
        <span class="col-span-2 text-center">
          <date-badge :date="match.matchDate" />
        </span>
      </div>
      <div class="grid grid-cols-3 my-2">
        <span class="first-capitalize">
          {{ $t("secretHitler.form.winningRole") }}
        </span>
        <span class="col-span-2 text-center">
          <secret-hitler-badge :role="match.winningRole" />
        </span>
      </div>
      <div class="grid grid-cols-3 my-2">
        <span class="first-capitalize">
          {{ $t("secretHitler.form.yourMatch") }}
        </span>
        <span class="col-span-2 text-center m-auto">
          <secret-hitler-badge :role="getCurrentPlayer(match)?.role" />
          <win-badge :win="getCurrentPlayer(match)?.win" />
        </span>
      </div>
      <hr class="my-2" />
      <div class="flex flex-row items-center justify-around">
        <span class="first-capitalize">
          {{ $t("secretHitler.form.players") }}
        </span>
        <div class="flex overflow-hidden px-1" :class="bindSpace(match)">
          <img
            v-for="p in match.players"
            :key="p._id"
            :src="image(p.player.profileImage, 500)"
            :title="`${p.player.name} ${p.player.surname}`"
            :class="borderColor(p.role)"
            class="inline-block h-8 w-8 rounded-full ring-2 my-2"
          />
        </div>
      </div>

      <hr class="my-2" />
      <div class="flex justify-items-center justify-around">
        <button class="base-button danger" @click="deleteMatch(match)">
          {{ $t("buttons.base.delete") }}

          <i class="fas fa-trash-alt"></i>
        </button>
        <button class="base-button info">
          {{ $t("buttons.base.edit") }}

          <i class="fas fa-edit"></i>
        </button>
        <button class="base-button primary" @click="copyMatch(match)">
          {{ $t("buttons.base.copy") }}

          <i class="fas fa-copy"></i>
        </button>
      </div>
    </article>
    <card-skeleton v-if="moreDataAvailable" @visible="getMoreData" />
  </div>
</template>

<script lang="ts">
import { range } from "@/utils/range";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { image } from "@/instances/sanity";
import { groq } from "@/utils/GroqQueryBuilder";
import { getPlayer } from "@/services/authService";
import WinBadge from "@/components/base/WinBadge.vue";
import DateBadge from "@/components/base/DateBadge.vue";
import { overlayService } from "@/services/overlayService";
import { player, secretHitlerMatch } from "@/types/sanity";
import CardSkeleton from "@/components/base/CardSkeleton.vue";
import { useRouterRefresh } from "@/composable/routerRefresh";
import { byRole } from "@/utils/sortables/secratHitlerSortables";
import { useInfiniteLoading } from "@/composable/infiniteLoading";
import { notificationService } from "@/services/notificationService";
import { sanityTypes, secretHitlerRole } from "@/constants/roleConstants";
import { secretHitlerService } from "@/services/games/secretHitlerService";
import SecretHitlerBadge from "@/components/secretHitler/secretHitlerBadge.vue";

const currentPlayer = getPlayer() as player;

const matchesQuery = new groq.QueryBuilder(sanityTypes.secretHitlerMatch)
  .select(`...,  players[] -> {..., player ->}`)
  .where(
    new groq.ConditionBuilder(`$userId in players[] -> player._ref`).params({
      userId: currentPlayer._id,
    })
  )
  .orderBy(new groq.OrderBuilder("matchDate", true));

export default defineComponent({
  components: { CardSkeleton, SecretHitlerBadge, DateBadge, WinBadge },
  setup() {
    const router = useRouter();

    const onResponse = (response: secretHitlerMatch[]) =>
      response.forEach((m) => m.players.sort(byRole));

    const infiniteLoading = useInfiniteLoading(matchesQuery, { onResponse });

    const { items, getMoreData, moreDataAvailable } = infiniteLoading;

    const deleteMatch = (match: secretHitlerMatch) =>
      overlayService.showOverlay() &&
      secretHitlerService
        .deleteExistingMatch(match)
        .then(() => notificationService.success("eliminazione eseguita"))
        .catch(notificationService.danger)
        .finally(() => overlayService.hideOverlay() && getMoreData(true));

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

    const getCurrentPlayer = (match: secretHitlerMatch) =>
      match.players.find((p) => p.player._id === currentPlayer._id);

    const copyMatch = (match: secretHitlerMatch) =>
      router.push({ name: "secretHitlerNew", query: { ref: match._id } });

    const bindSpace = (match: secretHitlerMatch) => {
      const players = match.players.length;

      if (range([9, 10], players)) return "-space-x-2";
      if (range([8, 9], players)) return "-space-x-1";
      return "";
    };

    useRouterRefresh(() => getMoreData(true));

    return {
      items,
      image,
      copyMatch,
      bindSpace,
      deleteMatch,
      borderColor,
      getMoreData,
      getCurrentPlayer,
      moreDataAvailable,
    };
  },
});
</script>


<style scoped>
.history-container {
  @apply grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:max-w-screen-2xl m-auto p-3;
}
</style>
