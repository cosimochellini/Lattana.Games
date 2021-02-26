<template>
  <h2 class="base-title p-4">Le tue partite recenti</h2>
  <div
    class="grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:max-w-screen-2xl m-auto p-4"
  >
    <article v-for="match in matches" :key="match._id" class="base-card">
      <div>Data : {{ dayFormatter(match.matchDate) }}</div>
      <div>
        Partito vittorioso : {{ $t(`secretHitler.roles.${match.winningRole}`) }}
      </div>
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
    <card-skeleton @visible="loadMatched" v-if="shouldContinueLoading" />
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { image } from "@/instances/sanity";
import { dayFormatter } from "@/utils/formatters";
import { getPlayer } from "@/services/authService";
import { defineComponent, nextTick, ref } from "vue";
import { overlayService } from "@/services/overlayService";
import { player, secretHitlerMatch } from "@/types/sanity";
import CardSkeleton from "@/components/base/CardSkeleton.vue";
import { byRole } from "@/utils/sortables/secratHitlerSortables";
import { notificationService } from "@/services/notificationService";
import { sanityTypes, secretHitlerRole } from "@/constants/roleConstants";
import { secretHitlerService } from "@/services/games/secretHitlerService";
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
  .orderBy(new OrderBuilder("matchDate", true))
  .cached();

export default defineComponent({
  components: { CardSkeleton },
  setup() {
    const router = useRouter();
    const shouldContinueLoading = ref(true);
    const matches = ref<secretHitlerMatch[]>([]);
    const currentPagination = new PaginationBuilder(0, 10);

    const resetMatches = () => {
      currentPagination.resetPage();
      matches.value = [];
      shouldContinueLoading.value = true;
    };

    const loadMatched = (fromZero: boolean = false) => {
      fromZero && resetMatches();

      matchesQuery
        .get(currentPagination.next())
        .fetch<secretHitlerMatch[]>()
        .then((response) => {
          response.forEach((m) => m.players.sort(byRole));

          matches.value = [...matches.value, ...response];

          shouldContinueLoading.value = false;
          nextTick(() => {
            shouldContinueLoading.value = currentPagination.shouldContinue(
              response
            );
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
      dayFormatter,
      shouldContinueLoading,
    };
  },
});
</script>
