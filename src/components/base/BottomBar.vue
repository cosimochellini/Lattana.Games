<template>
  <div class="mt-16"></div>
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
        />
        <span
          class="block text-sm capitalize tracking-wider"
          v-t="`bottom.route.${element.name}`"
        />
      </router-link>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { BottomTab } from "@/types/shared";
import routes from "@/configuration/bottomBar";
import { auth } from "@/services/auth.service";

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
    currentButtonBar(): BottomTab[] {
      const availableTabs =
        this.routes.find((r) => r.game == this.game)?.elements ?? [];

      return availableTabs.filter((tab) => auth.isAuthorized(tab.roles));
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
  @apply fixed inset-x-0 bottom-0 z-40 bg-white border rounded-t-md m-auto;
  @apply sm:w-11/12 md:w-1/2 lg:w-2/5 xl:w-2/6 2xl:w-1/4 sm:rounded-xl sm:shadow-2xl sm:bottom-5 md:border-2 border-gray-300;
}
</style>