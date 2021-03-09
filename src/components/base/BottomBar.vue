<template>
  <div class="w-full">
    <div class="mt-14"></div>
    <section class="fixed inset-x-0 bottom-0 z-50 bg-white border rounded-t-md">
      <div class="flex justify-between">
        <router-link
          class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
          :class="isActive(element.name) ? element.activeColor : ''"
          v-for="element in currentButtonBar"
          :key="element.name"
          :to="{ name: element.route }"
        >
          <i
            v-if="isActive(element.name)"
            :class="element.iconActive"
            class="fa-lg"
          ></i>
          <i v-else :class="`fa-${element.icon}`" class="fas fa-lg"></i>
          <span class="tab tab-home block text-sm capitalize tracking-wider">
            {{ $t(`bottom.route.${element.name}`) }}
          </span>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
type BottonElement = {
  name: string;
  icon: string;
  route: string;
  activeColor: string;
  iconActive: string;
};

const routes: { game: string; elements: BottonElement[] }[] = [
  {
    game: "trump",
    elements: [
      {
        name: "history",
        icon: "fas fa-history",
        iconActive: "fad fa-history",
        route: "trumpHistory",
        activeColor: "text-blue-700",
      },
      {
        name: "new",
        icon: "fas fa-plus-circle",
        iconActive: "fad fa-plus-circle",
        route: "trumpNew",
        activeColor: "text-blue-700",
      },
      {
        name: "stats",
        icon: "far fa-chart-bar",
        iconActive: "fad fa-chart-bar",
        route: "trumpStats",
        activeColor: "text-blue-700",
      },
    ],
  },
  {
    game: "secretHitler",
    elements: [
      {
        name: "history",
        icon: "fas fa-history",
        iconActive: "fas fa-plus-circle",
        activeColor: "text-red-800",
        route: "secretHitlerHistory",
      },
      {
        name: "new",
        icon: "fas fa-plus-circle",
        iconActive: "fas fa-plus-circle",
        route: "secretHitlerNew",
        activeColor: "text-red-800",
      },
      {
        name: "stats",
        icon: "fas fa-chart-bar",
        iconActive: "fas fa-plus-circle",
        route: "secretHitlerStats",
        activeColor: "text-red-800",
      },
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
  methods: {
    isActive(name: string) {
      return this.$route.matched.some((m) => m.path.includes(name));
    },
  },
});
</script>

<style>
</style>