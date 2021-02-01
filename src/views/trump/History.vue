<template>
  <div
    class="grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 lg:max-w-screen-2xl m-auto p-4"
  >
    <article v-for="match in matches" :key="match._id" class="base-card">
      <div>data : {{ dayFormatter(match.matchDate) }}</div>
      <div>punteggio iniziale : {{ match.startingScore }}</div>
      <div>punteggio finale : {{ match.finalScore }}</div>
      <hr class="my-2" />
      <div class="flex flex-row items-center justify-evenly">
        Giocatori:
        <div class="flex -space-x-1 overflow-hidden px-1">
          <img
            v-for="p in match.players"
            :key="p._id"
            :src="image(p.player.profileImage, 40)"
            :title="`${p.player.name} ${p.player.surname}`"
            class="inline-block h-10 w-10 rounded-full ring-2 my-2"
            :class="borderColor(p.win)"
            loading="lazy"
          />
        </div>
      </div>
      <hr class="my-2" />
      <div class="flex flex-row items-center justify-self-auto">
        Giocatore chiamante :
        <span class="ml-1">
          <img
            :src="image(match.callingPlayer.profileImage, 40)"
            loading="lazy"
            class="rounded-full"
            :title="`${match.callingPlayer.name} ${match.callingPlayer.surname}`"
          />
        </span>
      </div>
      <hr class="my-2" />
      <div class="flex justify-items-center justify-around">
        <button class="base-button danger" @click="deleteMatch(match)">
          Delete
          <i class="fas fa-trash-alt"></i>
        </button>
        <button class="base-button info" @click="editMatch(match)">
          Edit
          <i class="fas fa-edit"></i>
        </button>
        <button class="base-button primary" @click="copyMatch(match)">
          Copy
          <i class="fas fa-copy"></i>
        </button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { image } from "@/instances/sanity";
import { trumpMatch } from "@/types/sanity";
import { dayFormatter } from "@/utils/formatters";
import { defineComponent, onMounted, ref } from "vue";
import { sanityTypes } from "@/constants/roleConstants";
import { overlayService } from "@/services/overlayService";
import { trumpService } from "@/services/games/trumpService";
import { notificationService } from "@/services/notificationService";
import { OrderBuilder, QueryBuilder } from "@/utils/sanityQueryBuilder";

const matchesQuery = new QueryBuilder(sanityTypes.trumpMatch)
  .select(`...,  callingPlayer ->, players[] -> {player ->,...}`)
  .orderBy(new OrderBuilder("matchDate", true));

export default defineComponent({
  components: {},
  setup() {
    const matches = ref<trumpMatch[]>([]);
    const router = useRouter();

    const loadMatched = () => {
      matchesQuery
        .fetch<trumpMatch[]>()
        .then((responseMatches) => {
          responseMatches.forEach((m) =>
            m.players.sort((m1, m2) => Number(m1.win) - Number(m2.win))
          );
          matches.value = responseMatches;
        })
        .catch(notificationService.danger);
    };

    const deleteMatch = (match: trumpMatch) =>
      overlayService.showOverlay() &&
      trumpService
        .deleteExistingMatch(match)
        .then(() => notificationService.success("eliminazione eseguita"))
        .catch(notificationService.danger)
        .finally(() => overlayService.hideOverlay() && loadMatched());

    onMounted(loadMatched);

    const borderColor = (win: boolean) =>
      win ? "ring-blue-500" : "ring-red-500";

    const copyMatch = (match: trumpMatch) =>
      router.push({ name: "trumpNew", query: { ref: match._id } });

    const editMatch = (match: trumpMatch) =>
      router.push({ name: "trumpEdit", params: { id: match._id } });

    return {
      image,
      matches,
      copyMatch,
      editMatch,
      loadMatched,
      deleteMatch,
      borderColor,
      dayFormatter,
    };
  },
});
</script>
