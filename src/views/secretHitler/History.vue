<template>
  <h2 class="base-title p-4 first-capitalize">
    {{ $t("secretHitler.titles.recentMatches") }}
  </h2>
  <div
    class="grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:max-w-screen-2xl m-auto p-4"
  >
    <article v-for="match in matches" :key="match._id" class="base-card">
      <div class="grid grid-cols-3">
        <span class="first-capitalize">
          {{ $t("secretHitler.form.matchDate") }} :
        </span>
        <span class="col-span-2 text-center">
          <date-badge :date="match.matchDate" />
        </span>
      </div>
      <div class="grid grid-cols-3 my-2">
        <span class="first-capitalize">
          {{ $t("secretHitler.form.winningRole") }} :
        </span>
        <span class="col-span-2 text-center">
          <secret-hitler-badge :role="match.winningRole" />
        </span>
      </div>
      <div class="grid grid-cols-3 my-2">
        <span class="first-capitalize">
          {{ $t("secretHitler.form.yourMatch") }} :
        </span>
        <span class="col-span-2 text-center m-auto">
          <secret-hitler-badge :role="getCurrentPlayer(match)?.role" />
          <win-badge :win="getCurrentPlayer(match)?.win" />
        </span>
      </div>
      <hr class="my-2" />
      <div class="flex flex-row items-center justify-around">
        <span class="first-capitalize">
          {{ $t("secretHitler.form.players") }}:
        </span>
        <div class="flex -space-x-1 overflow-hidden px-1">
          <img
            v-for="p in match.players"
            :key="p._id"
            :src="image(p.player.profileImage, 100)"
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
    <card-skeleton @visible="loadMatched" v-if="moreDataAvaiable" />
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { image } from "@/instances/sanity";
import { getPlayer } from "@/services/authService";
import { defineComponent, nextTick, ref } from "vue";
import WinBadge from "@/components/base/WinBadge.vue";
import DateBadge from "@/components/base/DateBadge.vue";
import { overlayService } from "@/services/overlayService";
import { player, secretHitlerMatch } from "@/types/sanity";
import CardSkeleton from "@/components/base/CardSkeleton.vue";
import { byRole } from "@/utils/sortables/secratHitlerSortables";
import { notificationService } from "@/services/notificationService";
import { sanityTypes, secretHitlerRole } from "@/constants/roleConstants";
import { secretHitlerService } from "@/services/games/secretHitlerService";
import SecretHitlerBadge from "@/components/secretHitler/secretHitlerBadge.vue";

import {
  OrderBuilder,
  QueryBuilder,
  ConditionBuilder,
  PaginationBuilder,
} from "@/utils/sanityQueryBuilder";

const currentPlayer = getPlayer() as player;

const matchesQuery = new QueryBuilder(sanityTypes.secretHitlerMatch)
  .select(`...,  players[] -> {..., player ->}`)
  .where(
    new ConditionBuilder(`$userId in players[] -> player._ref`).params({
      userId: currentPlayer._id,
    })
  )
  .orderBy(new OrderBuilder("matchDate", true));

export default defineComponent({
  components: { CardSkeleton, SecretHitlerBadge, DateBadge, WinBadge },
  setup() {
    const router = useRouter();
    const moreDataAvaiable = ref(true);
    const matches = ref<secretHitlerMatch[]>([]);
    const currentPagination = new PaginationBuilder(0, 10);

    const resetMatches = () => {
      currentPagination.resetPage();
      matches.value = [];
      moreDataAvaiable.value = true;
    };

    const loadMatched = (fromZero: boolean = false) => {
      fromZero && resetMatches();

      matchesQuery
        .get(currentPagination.next())
        .fetch<secretHitlerMatch[]>()
        .then((response) => {
          response.forEach((m) => m.players.sort(byRole));

          matches.value = [...matches.value, ...response];

          moreDataAvaiable.value = false;
          nextTick(() => {
            moreDataAvaiable.value = currentPagination.shouldContinue(response);
          });
        })
        .catch(notificationService.danger);
    };

    const deleteMatch = (match: secretHitlerMatch) =>
      overlayService.showOverlay() &&
      secretHitlerService
        .deleteExistingMatch(match)
        .then(() => notificationService.success("eliminazione eseguita"))
        .catch(notificationService.danger)
        .finally(() => overlayService.hideOverlay() && loadMatched(true));

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

    // onMounted(() => loadMatched());

    return {
      image,
      matches,
      copyMatch,
      deleteMatch,
      loadMatched,
      borderColor,
      moreDataAvaiable,
      getCurrentPlayer,
    };
  },
});
</script>
