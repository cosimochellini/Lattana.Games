<template>
  <div
    class="grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 lg:max-w-screen-2xl m-auto p-4"
  >
    <article
      v-for="match in matches"
      :key="match._id"
      class="base-card"
    >
      <div>data : {{ dayFormatter(match.matchDate) }}</div>
      <div>punteggio iniziale : {{ match.startingScore }}</div>
      <div>punteggio finale : {{ match.finalScore }}</div>
      <hr class="my-2" />
      <div class="flex flex-row items-center justify-around">
        Giocatori:
        <span v-for="p in match.players" :key="p._id" class="ml-1">
          <img
            :src="image(p.player.profileImage)"
            loading="lazy"
            class="rounded-full"
            :title="`${p.player.name} ${p.player.surname}`"
          />
        </span>
      </div>
      <hr class="my-2" />
      <div class="flex flex-row items-center justify-self-auto">
        Giocatore chiamante :
        <span class="ml-1">
          <img
            :src="image(match.callingPlayer.profileImage)"
            loading="lazy"
            class="rounded-full"
            :title="`${match.callingPlayer.name} ${match.callingPlayer.surname}`"
          />
        </span>
      </div>
      <hr class="my-2" />
      <div class="flex justify-items-center justify-around">
        <button
          class="px-2 py-1 shadow-sm bg-red-200 rounded-md w-20"
          @click="deleteMatch(match)"
        >
          Delete
        </button>
        <button class="px-2 py-1 shadow-sm bg-blue-200 rounded-md w-20">
          Edit
        </button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { urlFor } from "@/instances/sanity";
import { trumpMatch } from "@/types/sanity";
import { dayFormatter } from "@/utils/formatters";
import { defineComponent, onMounted, ref } from "vue";
import { sanityTypes } from "@/constants/roleConstants";
import { trumpService } from "@/services/games/trumpService";
import { notificationService } from "@/services/notificationService";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { OrderBuilder, QueryBuilder } from "@/utils/sanityQueryBuilder";

const matchesQuery = new QueryBuilder(sanityTypes.trumpMatch)
  .select(`...,  callingPlayer ->, players[] -> {player ->,...}`)
  .orderBy(new OrderBuilder("matchDate", true));

export default defineComponent({
  components: {},
  setup() {
    const matches = ref<trumpMatch[]>([]);

    const loadMatched = () => {
      matchesQuery
        .fetch<trumpMatch[]>()
        .then((data) => (matches.value = data))
        .catch(notificationService.danger);
    };

    const image = (img: SanityImageSource) => urlFor(img).width(40);
    const deleteMatch = (match: trumpMatch) =>
      trumpService
        .deleteExistingMatch(match)
        .then(() => notificationService.success("eliminazione eseguita"))
        .catch(notificationService.danger)
        .finally(loadMatched);

    onMounted(loadMatched);

    return { matches, loadMatched, image, dayFormatter, deleteMatch };
  },
});
</script>
