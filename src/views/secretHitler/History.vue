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
        <div
          class="flex overflow-hidden px-1"
          :class="tailwind.secretHitler.bindSpace(match)"
        >
          <img
            v-for="p in match.players"
            :key="p._id"
            :src="image(p.player.profileImage, 500)"
            :title="`${p.player.name} ${p.player.surname}`"
            :class="tailwind.secretHitler.borderColor(p.role)"
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
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { image } from "@/instances/sanity";
import { secretHitlerMatch } from "@/types";
import WinBadge from "@/components/base/WinBadge.vue";
import { tailwind } from "@/services/tailwind.service";
import DateBadge from "@/components/base/DateBadge.vue";
import { getCurrentPlayer } from "@/utils/sharedFunctions";
import CardSkeleton from "@/components/base/CardSkeleton.vue";
import { useRouterRefresh } from "@/composable/routerRefresh";
import { secretHitler } from "@/services/games/secretHitler.service";
import SecretHitlerBadge from "@/components/secretHitler/secretHitlerBadge.vue";

export default defineComponent({
  components: { CardSkeleton, SecretHitlerBadge, DateBadge, WinBadge },
  setup() {
    const router = useRouter();

    const { items, getMoreData, moreDataAvailable } = secretHitler.getMatches();

    const deleteMatch = async (match: secretHitlerMatch) =>
      secretHitler
        .deleteExistingMatch(match)
        .then((success) => success && getMoreData(true));

    const copyMatch = (match: secretHitlerMatch) =>
      router.push({ name: "secretHitlerNew", query: { ref: match._id } });

    useRouterRefresh(() => getMoreData(true));
    return {
      items,
      image,
      tailwind,
      copyMatch,
      deleteMatch,
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
