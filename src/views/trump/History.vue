<template>
  <h2 class="base-title p-4 first-capitalize">
    {{ $t("trump.titles.recentMatches") }}
  </h2>
  <div
    class="grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:max-w-screen-2xl m-auto p-3"
  >
    <article v-for="match in matches" :key="match._id" class="base-card">
      <div class="grid grid-cols-2">
        <span class="first-capitalize">
          {{ $t("trump.form.matchDate") }}
        </span>
        <span class="text-center">
          <date-badge :date="match.matchDate" />
        </span>
      </div>
      <div class="grid grid-cols-2 my-2">
        <span class="first-capitalize">
          {{ $t("trump.form.scores") }}
        </span>
        <span class="text-center">
          <badge :text="match.startingScore.toString()" />
          <badge
            :text="match.finalScore.toString()"
            :background="
              match.finalScore >= match.startingScore
                ? 'bg-green-200'
                : 'bg-red-200'
            "
            :textColor="
              match.finalScore >= match.startingScore
                ? 'text-green-900'
                : 'text-red-900'
            "
          />
        </span>
      </div>

      <div class="grid grid-cols-2 my-2">
        <span class="first-capitalize">
          {{ $t("trump.form.outcome") }}
        </span>
        <span class="text-center">
          <win-badge :win="getCurrentPlayer(match)?.win" />
        </span>
      </div>
      <hr class="my-2" />
      <div class="flex flex-row items-center place-content-between">
        <span class="first-capitalize"> {{ $t("trump.form.players") }} </span>
        <div
          class="flex flex-grow m-auto -space-x-1 overflow-hidden px-1 content-center justify-center"
        >
          <img
            v-for="p in match.players"
            :key="p._id"
            :src="image(p.player.profileImage, 40)"
            :title="`${p.player.name} ${p.player.surname}`"
            :class="borderColor(p.win)"
            class="inline-block h-10 w-10 rounded-full ring-2 my-2"
          />
        </div>
      </div>
      <hr class="my-2" />
      <div class="flex flex-row items-center justify-self-auto">
        <span class="first-capitalize">
          {{ $t("trump.form.callingPlayer") }}
        </span>
        <div
          class="flex flex-grow m-auto -space-x-1 overflow-hidden px-1 content-center justify-center"
        >
          <img
            :src="image(match.callingPlayer.profileImage, 40)"
            class="rounded-full"
            :title="`${match.callingPlayer.name} ${match.callingPlayer.surname}`"
          />
        </div>
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
    <card-skeleton @visible="getMoreData" v-if="moreDataAvailable" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { image } from "@/instances/sanity";
import Badge from "@/components/base/Badge.vue";
import { dayFormatter } from "@/utils/formatters";
import { getPlayer } from "@/services/authService";
import { player, trumpMatch } from "@/types/sanity";
import WinBadge from "@/components/base/WinBadge.vue";
import DateBadge from "@/components/base/DateBadge.vue";
import { sanityTypes } from "@/constants/roleConstants";
import { overlayService } from "@/services/overlayService";
import { trumpService } from "@/services/games/trumpService";
import CardSkeleton from "@/components/base/CardSkeleton.vue";
import { useInfiniteLoading } from "@/composable/infiniteLoading";
import { notificationService } from "@/services/notificationService";

import {
  OrderBuilder,
  QueryBuilder,
  ConditionBuilder,
} from "@/utils/sanityQueryBuilder";

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
  components: { CardSkeleton, DateBadge, Badge, WinBadge },
  setup() {
    const router = useRouter();

    const {
      getMoreData,
      items: matches,
      moreDataAvailable,
    } = useInfiniteLoading<trumpMatch>(matchesQuery, { pageSize: 6 });

    const deleteMatch = (match: trumpMatch) =>
      overlayService.showOverlay() &&
      trumpService
        .deleteExistingMatch(match)
        .then(() => notificationService.success("eliminazione eseguita"))
        .catch(notificationService.danger)
        .finally(() => overlayService.hideOverlay() && getMoreData(true));

    const borderColor = (win: boolean) =>
      win ? "ring-blue-500" : "ring-red-500";

    const copyMatch = (match: trumpMatch) =>
      router.push({ name: "trumpNew", query: { ref: match._id } });

    const editMatch = (match: trumpMatch) =>
      router.push({ name: "trumpEdit", params: { id: match._id } });

    const getCurrentPlayer = (match: trumpMatch) =>
      match.players.find((p) => p.player._id === currentPlayer._id);

    return {
      image,
      matches,
      copyMatch,
      editMatch,
      getMoreData,
      deleteMatch,
      borderColor,
      dayFormatter,
      getCurrentPlayer,
      moreDataAvailable,
    };
  },
});
</script>
