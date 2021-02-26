<template>
  <h2 class="base-title p-4">Le tue partite recenti</h2>
  <div
    class="grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:max-w-screen-2xl m-auto p-4"
  >
    <article v-for="match in matches" :key="match._id" class="base-card">
      <div>Data : {{ dayFormatter(match.matchDate) }}</div>
      <div>Punteggio iniziale : {{ match.startingScore }}</div>
      <div>Punteggio finale : {{ match.finalScore }}</div>
      <hr class="my-2" />
      <div class="flex flex-row items-center place-content-between">
        <span class="">Giocatori:</span>
        <div
          class="flex flex-grow m-auto -space-x-1 overflow-hidden px-1 ml-10"
        >
          <img
            v-for="p in match.players"
            :key="p._id"
            :src="image(p.player.profileImage, 40)"
            :title="`${p.player.name} ${p.player.surname}`"
            class="inline-block h-10 w-10 rounded-full ring-2 my-2"
            :class="borderColor(p.win)"
          />
        </div>
      </div>
      <hr class="my-2" />
      <div class="flex flex-row items-center justify-self-auto">
        Giocatore chiamante :
        <span class="text-center m-auto ml-16">
          <img
            :src="image(match.callingPlayer.profileImage, 40)"
            class="rounded-full"
            :title="`${match.callingPlayer.name} ${match.callingPlayer.surname}`"
          />
        </span>
      </div>
      <hr class="my-2" />
      <div class="flex justify-items-center justify-around">
        <button class="base-button danger" @click="deleteMatch(match)">
          {{ $t("buttons.base.delete") }}
          <i class="fas fa-trash-alt"></i>
        </button>
        <!-- @click="editMatch(match)" -->
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
    <card-skeleton @visible="loadMatched" v-show="shouldContinueLoading" />
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { image } from "@/instances/sanity";
import { player, trumpMatch } from "@/types/sanity";
import { dayFormatter } from "@/utils/formatters";
import { defineComponent, onMounted, ref } from "vue";
import { sanityTypes } from "@/constants/roleConstants";
import { overlayService } from "@/services/overlayService";
import { trumpService } from "@/services/games/trumpService";
import { notificationService } from "@/services/notificationService";
import {
  OrderBuilder,
  QueryBuilder,
  ConditionBuilder,
  PaginationBuilder,
} from "@/utils/sanityQueryBuilder";
import { getPlayer } from "@/services/authService";
import CardSkeleton from "@/components/base/CardSkeleton.vue";

const currentPlayer = getPlayer() as player;

const matchesQuery = new QueryBuilder(sanityTypes.trumpMatch)
  .select(`...,  callingPlayer ->, players[] -> {player ->,...}`)
  .where(
    new ConditionBuilder(`$userId in players[] -> player._ref`).params({
      userId: currentPlayer._id,
    })
  )
  .orderBy(new OrderBuilder("matchDate", true));

export default defineComponent({
  components: { CardSkeleton },
  setup() {
    const router = useRouter();
    const matches = ref<trumpMatch[]>([]);
    const shouldContinueLoading = ref(false);
    const currentPagination = new PaginationBuilder(0, 12);

    const resetMatches = () => {
      currentPagination.resetPage();
      matches.value = [];
      shouldContinueLoading.value = true;
    };

    const loadMatched = (fromZero: boolean = false) => {
      fromZero && resetMatches();

      matchesQuery
        .get(currentPagination.next())
        .fetch<trumpMatch[]>()
        .then((response) => {
          response.forEach((m) =>
            m.players.sort((m1, m2) => Number(m1.win) - Number(m2.win))
          );
          matches.value = [...matches.value, ...response];
          shouldContinueLoading.value = currentPagination.shouldContinue(
            response
          );
        })
        .catch(notificationService.danger);
    };

    const deleteMatch = (match: trumpMatch) =>
      overlayService.showOverlay() &&
      trumpService
        .deleteExistingMatch(match)
        .then(() => notificationService.success("eliminazione eseguita"))
        .catch(notificationService.danger)
        .finally(() => overlayService.hideOverlay() && loadMatched(true));

    const borderColor = (win: boolean) =>
      win ? "ring-blue-500" : "ring-red-500";

    const copyMatch = (match: trumpMatch) =>
      router.push({ name: "trumpNew", query: { ref: match._id } });

    const editMatch = (match: trumpMatch) =>
      router.push({ name: "trumpEdit", params: { id: match._id } });

    onMounted(() => loadMatched());

    return {
      image,
      matches,
      copyMatch,
      editMatch,
      loadMatched,
      deleteMatch,
      borderColor,
      dayFormatter,
      shouldContinueLoading,
    };
  },
});
</script>
