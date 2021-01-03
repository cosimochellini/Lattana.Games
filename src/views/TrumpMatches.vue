<template>
  <div class="flex-col content-center m-auto">
    <div
      v-for="match in matches"
      :key="match._id"
      class="bg-gray-100 p-4 m-auto max-w-6xl border-4 border-blue-500 border-opacity-50 rounded-md"
    >
      <div>data : {{ dayFormatter(match.matchDate) }}</div>
      <div>punteggio iniziale : {{ match.startingScore }}</div>
      <div>punteggio finale : {{ match.finalScore }}</div>
      <div class="flex flex-row items-center">
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
      <hr />
      <div class="flex flex-row items-center mt-2">
        Giocatore chiamante :

        <!-- <span>
          {{ match.callingPlayer.name }} {{ match.callingPlayer.surname }}
        </span> -->
        <span class="ml-1">
          <img
            :src="image(match.callingPlayer.profileImage)"
            loading="lazy"
            class="rounded-full"
            :title="`${match.callingPlayer.name} ${match.callingPlayer.surname}`"
          />
        </span>
      </div>
      <hr class="mt-2" />
    </div>
  </div>
</template>

<script lang="ts">
import { urlFor } from "@/istances/sanity";
import { trumpMatch } from "@/types/sanity";
import { dayFormatter } from "@/utils/formatters";
import { defineComponent, onMounted, ref } from "vue";
import { sanityTypes } from "@/constants/roleConstants";
import { notificationService } from "@/services/notificationService";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { OrderBuilder, QueryBuilder } from "@/utils/sanityQueryBuilder";

const matchesQuery = new QueryBuilder(sanityTypes.trumpMatch)
  .select(
    `
  matchDate, 
  startingScore, 
  finalScore, 
  callingPlayer -> {name, surname, profileImage}, 
  players[] -> {player -> {name, surname, profileImage}, win}
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

    onMounted(loadMatched);

    return { matches, loadMatched, image, dayFormatter };
  },
});
</script>
