<template>
  <div
    class="grid grid-flow-row gap-4 grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 lg:max-w-screen-2xl m-auto"
  >
    <div
      v-for="match in matches"
      :key="match._id"
      class="bg-gray-100 p-4 max-w-6xl border-4 border-blue-500 border-opacity-50 rounded-md"
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
          class="px-2 py-1 border-2 bg-red-200 rounded-md w-20"
          @click="deleteMatch(match)"
        >
          Delete
        </button>
        <button class="px-2 py-1 border-2 bg-blue-200 rounded-md w-20">
          Edit
        </button>
      </div>
      <hr class="my-2" />
    </div>
  </div>
</template>

<script lang="ts">
import { urlFor } from "@/istances/sanity";
import { trumpMatch } from "@/types/sanity";
import { dayFormatter } from "@/utils/formatters";
import { defineComponent, onMounted, ref } from "vue";
import { sanityTypes } from "@/constants/roleConstants";
import { deleteExistingMatch } from "@/services/matchService";
import { notificationService } from "@/services/notificationService";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { OrderBuilder, QueryBuilder } from "@/utils/sanityQueryBuilder";

const matchesQuery = new QueryBuilder(sanityTypes.trumpMatch)
  .select(
    `
   _id, 
  matchDate, 
  startingScore, 
  finalScore, 
  callingPlayer -> {name, surname, profileImage}, 
  players[] -> {player -> {name, surname, profileImage}, win, _id}
  `
  )
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
      deleteExistingMatch(match)
        .then(() => notificationService.success("eliminazione eseguita"))
        .catch(notificationService.danger)
        .finally(loadMatched);

    onMounted(loadMatched);

    return { matches, loadMatched, image, dayFormatter, deleteMatch };
  },
});
</script>
