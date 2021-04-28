<template>
  <span class="history-container items-center">
    <h2
      class="base-title first-capitalize"
      v-t="'secretHitler.titles.recentMatches'"
    ></h2>
    <current-user
      allowEmpty
      :playerRetriever="user.getActualSecretHitlerPlayers"
      v-model="actualPlayer"
      class="items-center"
    />
  </span>
  <div class="history-container">
    <article v-for="match in items" :key="match._id" class="base-card">
      <div class="grid grid-cols-3">
        <span class="first-capitalize" v-t="'secretHitler.form.matchDate'" />
        <span class="col-span-2 text-center">
          <date-badge :date="match.matchDate" />
        </span>
      </div>
      <div class="grid grid-cols-3 my-2">
        <span class="first-capitalize" v-t="'secretHitler.form.winningRole'" />

        <span class="col-span-2 text-center">
          <secret-hitler-badge :role="match.winningRole" />
        </span>
      </div>
      <div class="grid grid-cols-3 my-2">
        <span class="first-capitalize" v-t="'secretHitler.form.yourMatch'" />

        <span class="col-span-2 text-center m-auto">
          <secret-hitler-badge
            :role="getCurrentPlayer(match, actualPlayer._id)?.role"
          />
          <win-badge :win="getCurrentPlayer(match, actualPlayer._id)?.win" />
        </span>
      </div>
      <hr class="my-2" />
      <div class="flex flex-row items-center justify-around">
        <span class="first-capitalize" v-t="'secretHitler.form.players'" />
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
    <card-skeleton v-if="moreDataAvailable" @visible="getMoreData" />
    <empty-card-result v-if="emptyResult" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { image } from "@/instances/sanity";
import { secretHitlerMatch } from "@/types";
import { guard } from "@/services/guard.service";
import WinBadge from "@/components/base/WinBadge.vue";
import { tailwind } from "@/services/tailwind.service";
import DateBadge from "@/components/base/DateBadge.vue";
import { getCurrentPlayer } from "@/utils/sharedFunctions";
import CardSkeleton from "@/components/base/CardSkeleton.vue";
import { useRouterRefresh } from "@/composable/routerRefresh";
import EmptyCardResult from "@/components/base/EmptyCardResult.vue";
import { secretHitler } from "@/services/games/secretHitler.service";
import SecretHitlerBadge from "@/components/secretHitler/secretHitlerBadge.vue";
import CurrentUser from "@/components/base/CurrentUser.vue";
import { user } from "@/services/user.service";
import { auth } from "@/services/auth.service";

export default defineComponent({
  components: {
    CardSkeleton,
    SecretHitlerBadge,
    DateBadge,
    WinBadge,
    EmptyCardResult,
    CurrentUser,
  },
  setup() {
    const router = useRouter();
    const actualPlayer = ref(auth.currentPlayer);

    const {
      items,
      getMoreData,
      moreDataAvailable,
      emptyResult,
    } = secretHitler.getMatches(actualPlayer);
    watch(actualPlayer, () => getMoreData(true));

    const deleteMatch = async (match: secretHitlerMatch) =>
      secretHitler
        .deleteExistingMatch(match)
        .then((success) => success && getMoreData(true));

    const copyMatch = (match: secretHitlerMatch) =>
      router.push({ name: "secretHitlerNew", query: { ref: match._id } });

    useRouterRefresh(() => getMoreData(true));

    return {
      user,
      items,
      guard,
      image,
      tailwind,
      copyMatch,
      deleteMatch,
      emptyResult,
      getMoreData,
      actualPlayer,
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
