<template>
  <div
    class="grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 lg:max-w-screen-2xl m-auto p-4"
  >
    <h2 class="base-title">Le tue partite recenti</h2>

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
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { image } from "@/instances/sanity";
import { dayFormatter } from "@/utils/formatters";
import { player, secretHitlerMatch } from "@/types/sanity";
import { getPlayer } from "@/services/authService";
import { defineComponent, onMounted, ref } from "vue";
import { overlayService } from "@/services/overlayService";
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
  .get(new PaginationBuilder(1, 6));

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
