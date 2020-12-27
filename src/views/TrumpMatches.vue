<template>
  <div class="flex-col content-center m-auto">
    <div
      v-for="match in matches"
      :key="match._id"
      class="bg-red-50 p-2 m-auto content-center items-center self-center max-w-6xl"
    >
      <div>data : {{ formatDate(match.matchDate) }}</div>
      <div>punteggio iniziale : {{ match.startingScore }}</div>
      <div>punteggio finale : {{ match.finalScore }}</div>
      <div class="flex flex-row">
        <span v-for="p in match.players" :key="p._id" class="ml-1">
          <img
            :src="image(p.player.profileImage)"
            loading="lazy"
            class="rounded-full"
            :title="`${p.player.name} ${p.player.surname}`"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { sanityClient, urlFor } from "@/istances/sanity";
import { defineComponent, onMounted, ref } from "vue";
import { trumpMatches } from "@/constants/groq/trumpMatch";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export default defineComponent({
  setup() {
    const matches = ref([]);

    const loadMatched = () => {
      sanityClient
        .fetch(trumpMatches)
        .then((data) => (matches.value = data))
        .catch(console.log);
    };

    const formatDate = (date: string) => new Date(date).toLocaleString();

    const image = (img: SanityImageSource) => urlFor(img).width(40);

    onMounted(() => loadMatched());

    return { matches, loadMatched, formatDate, image };
  },
});
</script>
