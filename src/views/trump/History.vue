<template>
  <h2 class="history-container base-title">
    <span class="first-capitalize" v-t="'trump.titles.recentMatches'" />
  </h2>
  <span class="history-container p-0!" v-if="guard.role.nosy">
    <h2
      class="font-semibold leading-3 block tracking-wider first-capitalize"
      v-t="'trump.form.currentPlayer'"
    />
    <user-autocomplete v-model="actualPlayer" allowEmpty class="block px-2" />
  </span>

  <div class="history-container">
    <article v-for="match in items" :key="match._id" class="base-card">
      <div class="grid grid-cols-2">
        <span class="first-capitalize" v-t="'trump.form.matchDate'" />
        <span class="text-center">
          <date-badge :date="match.matchDate" />
        </span>
      </div>
      <div class="grid grid-cols-2 my-2">
        <span class="first-capitalize" v-t="'trump.form.scores'" />

        <span class="text-center">
          <badge :text="match.startingScore.toString()" />
          <badge
            :text="match.finalScore.toString()"
            :background="tailwind.trump.background(match)"
            :textColor="tailwind.trump.text(match)"
          />
        </span>
      </div>

      <div class="grid grid-cols-2 my-2">
        <span class="first-capitalize" v-t="'trump.form.outcome'" />

        <span class="text-center">
          <win-badge :win="getCurrentPlayer(match)?.win" />
        </span>
      </div>
      <hr class="my-2" />
      <div class="flex flex-row items-center place-content-between">
        <span class="first-capitalize" v-t="'trump.form.players'" />
        <div
          class="flex flex-grow m-auto -space-x-1 overflow-hidden px-1 content-center justify-center"
        >
          <img
            v-for="p in match.players"
            :key="p._id"
            :class="tailwind.base.ringColor(p.win)"
            :src="image(p.player.profileImage, 500)"
            :title="`${p.player.name} ${p.player.surname}`"
            class="inline-block h-10 w-10 rounded-full ring-2 my-2"
          />
        </div>
      </div>
      <hr class="my-2" />
      <div class="flex flex-row items-center justify-self-auto">
        <span class="first-capitalize" v-t="'trump.form.callingPlayer'" />

        <div
          class="flex flex-grow m-auto -space-x-1 overflow-hidden px-1 content-center justify-center"
        >
          <img
            :src="image(match.callingPlayer.profileImage, 500)"
            class="rounded-full h-12 w-12"
            :title="`${match.callingPlayer.name} ${match.callingPlayer.surname}`"
          />
        </div>
      </div>
      <hr class="my-2" v-show="guard.role.editor" />

      <div
        class="flex justify-items-center justify-around"
        v-show="guard.role.editor"
      >
        <button class="base-button danger" @click="deleteMatch(match)">
          <span v-t="'buttons.base.delete'" />
          <i class="fas fa-trash-alt" />
        </button>

        <button class="base-button info">
          <span v-t="'buttons.base.edit'" />
          <i class="fas fa-edit" />
        </button>

        <button class="base-button primary" @click="copyMatch(match)">
          <span v-t="'buttons.base.copy'" />
          <i class="fas fa-copy" />
        </button>
      </div>
    </article>

    <empty-card-result v-if="emptyResult" />
    <card-skeleton @visible="getMoreData" v-if="moreDataAvailable" />
  </div>
</template>

<script lang="ts">
import { trumpMatch } from "@/types";
import { useRouter } from "vue-router";
import { image } from "@/instances/sanity";
import { auth } from "@/services/auth.service";
import Badge from "@/components/base/Badge.vue";
import { guard } from "@/services/guard.service";
import { defineComponent, ref, watch } from "vue";
import WinBadge from "@/components/base/WinBadge.vue";
import { trump } from "@/services/games/trump.service";
import { tailwind } from "@/services/tailwind.service";
import DateBadge from "@/components/base/DateBadge.vue";
import { getCurrentPlayer } from "@/utils/sharedFunctions";
import { useRouterRefresh } from "@/composable/routerRefresh";
import CardSkeleton from "@/components/base/CardSkeleton.vue";
import EmptyCardResult from "@/components/base/EmptyCardResult.vue";
import UserAutocomplete from "@/components/form/UserAutocomplete.vue";

export default defineComponent({
  components: {
    CardSkeleton,
    DateBadge,
    Badge,
    WinBadge,
    UserAutocomplete,
    EmptyCardResult,
  },
  setup() {
    const router = useRouter();
    const actualPlayer = ref(auth.currentPlayer);

    const {
      items,
      emptyResult,
      getMoreData,
      moreDataAvailable,
    } = trump.getMatches(actualPlayer);

    watch(actualPlayer, () => getMoreData(true));

    const deleteMatch = (match: trumpMatch) =>
      trump
        .deleteExistingMatch(match)
        .then((success) => success && getMoreData(true));

    const copyMatch = (match: trumpMatch) =>
      router.push({ name: "trumpNew", query: { ref: match._id } });

    const editMatch = (match: trumpMatch) =>
      router.push({ name: "trumpEdit", params: { id: match._id } });

    useRouterRefresh(() => getMoreData(true));

    return {
      image,
      guard,
      items,
      tailwind,
      copyMatch,
      editMatch,
      getMoreData,
      emptyResult,
      deleteMatch,
      actualPlayer,
      getCurrentPlayer,
      moreDataAvailable,
    };
  },
});
</script>

<style scoped>
.history-container {
  @apply grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:max-w-screen-2xl m-auto p-3;
}
</style>
