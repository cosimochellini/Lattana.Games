<template>
  <div class="w-full">
    <div class="mt-14"></div>
    <section class="fixed inset-x-0 bottom-0 z-10 bg-white shadow">
      <div class="flex justify-between">
        <router-link
          class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
          v-for="element in currentButtonBar"
          :key="element.name"
          :to="{ name: element.route }"
        >
          <i :class="`fa-${element.icon}`" class="fas fa-lg"></i>
          <span class="tab tab-home block text-sm">{{ element.name }}</span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
type BottonElement = { name: string; icon: string; route: string };

const routes: { game: string; elements: BottonElement[] }[] = [
  {
    game: "trump",
    elements: [
      {
        name: "cronologia partite",
        icon: "history",
        route: "trumpHistory",
      },
      { name: "nuova partita", icon: "plus-circle", route: "trumpNew" },
      { name: "statistiche", icon: "chart-bar", route: "trumpStats" },
    ],
  },
  {
    game: "secretHitler",
    elements: [
      {
        name: "cronologia partite",
        icon: "history",
        route: "secretHitlerHistory",
      },
      { name: "nuova partita", icon: "plus-circle", route: "secretHitlerNew" },
      { name: "statistiche", icon: "chart-bar", route: "secretHitlerStats" },
    ],
  },
];
export default defineComponent({
  data() {
    return { routes };
  },
  props: {
    game: {
      type: String,
      required: true,
    },
  },
  computed: {
    currentButtonBar(): BottonElement[] {
      return this.routes.find((r) => r.game == this.game)?.elements ?? [];
    },
  },
});
</script>

<style>
</style>