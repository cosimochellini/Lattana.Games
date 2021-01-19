<template>
  <div class="w-full">
    <!-- <section id="bottom-navigation" class="md:hidden block fixed inset-x-0 bottom-0 z-10 bg-white shadow"> // if shown only tablet/mobile-->
    <section class="block fixed inset-x-0 bottom-0 z-10 bg-white shadow">
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
import { Dictionary } from "@/types/base";
import { defineComponent } from "vue";
type BottonElement = { name: string; icon: string; route: string };

const routes: Dictionary<Dictionary<BottonElement>> = {
  trump: {
    history: {
      name: "cronologia partite",
      icon: "history",
      route: "trumpHistory",
    },
    new: { name: "nuova partita", icon: "plus-circle", route: "trumpNew" },
    stats: { name: "statistiche", icon: "chart-bar", route: "trumpStats" },
  },
  secretHitler: {
    history: {
      name: "cronologia partite",
      icon: "fas fa-history",
      route: "history",
    },
    new: { name: "nuova partita", icon: "fas fa-new", route: "history" },
    stats: { name: "statistiche", icon: "fas fa-stats", route: "history" },
  },
};

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
    currentButtonBar(): Dictionary<BottonElement> {
      return this.routes[this.game];
    },
  },
});
</script>

<style>
</style>