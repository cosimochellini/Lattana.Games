<template>
  <div class="mt-14"></div>
  <section class="bottom-bar">
    <div class="flex justify-between">
      <router-link
        class="w-full focus:text-teal-500 hover:text-teal-500 justify-center inline-block text-center pt-2 pb-1"
        :class="
          isActive(element.name)
            ? `${element.activeColor} font-bold tracking-widest `
            : ''
        "
        v-for="element in currentButtonBar"
        :key="element.name"
        :to="{ name: element.route }"
      >
        <i
          :class="isActive(element.name) ? element.iconActive : element.icon"
          class="fa-lg"
        ></i>
        <span class="tab tab-home block text-sm capitalize tracking-wider">
          {{ $t(`bottom.route.${element.name}`) }}
        </span>
      </router-link>
    </div>
  </section>
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
        iconActive: "fad fa-history",
        activeColor: "text-red-800",
        route: "secretHitlerHistory",
      },
      {
        name: "new",
        icon: "fas fa-plus-circle",
        iconActive: "fad fa-plus-circle",
        route: "secretHitlerNew",
        activeColor: "text-red-800",
      },
      {
        name: "stats",
        icon: "far fa-chart-bar",
        iconActive: "fad fa-chart-bar",
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

<style scoped>
.bottom-bar {
  @apply fixed inset-x-0 bottom-0 z-50 bg-white border rounded-t-md m-auto;
  @apply md:w-1/2 lg:w-1/4 md:rounded-xl md:shadow-2xl md:bottom-5 md:border-2 border-gray-300;
}
</style>