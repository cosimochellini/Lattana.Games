<template>
  <nav class="rounded-b-md" :class="currentState.color">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-900 focus:bg-transparent transition duration-150 ease-in-out"
            aria-label="Main menu"
            aria-expanded="false"
            @click.stop="menuClick"
          >
            <i class="fas fa-bars" v-if="!state.menuOpen"></i>
            <i class="fas fa-times" v-else></i>
          </button>
        </div>
        <div
          class="flex-1 flex items-center place-items-center content-center justify-center sm:items-stretch sm:justify-start justify-items-center text-gray-900"
        >
          <span
            class="font-semibold leading-3 text-2xl tracking-widest capitalize md:mt-2"
          >
            {{ $t(`navbar.route.${currentState.name}`) }}
          </span>
          <div class="flex-shrink-0">
            <i
              class="block w-auto"
              :class="`ml-1 text-2xl ${currentState.icon}`"
            >
            </i>
          </div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex">
              <router-link
                v-for="(route, index) in navbarRoutes"
                :key="route.route"
                :to="{ name: route.route, params: { locale } }"
                class="px-3 py-2 rounded-md text-md font-medium leading-5 focus:outline-none transition duration-150 ease-in-out text-gray-900 hover:text-white"
                :class="index ? 'ml-4' : ''"
              >
                {{ $t(`navbar.route.${route.name}`) }}
              </router-link>
            </div>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
        >
          <!-- Profile dropdown -->
          <div class="ml-3 relative">
            <div>
              <button
                class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out"
                id="user-menu"
                aria-label="User menu"
                aria-haspopup="true"
              >
                <img
                  @click="profileClick"
                  class="h-10 w-10 rounded-full border border-gray-900"
                  :src="profileSrc"
                  alt="User Profile"
                />
              </button>
            </div>
            <div
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50"
              :class="{
                absolute: state.profileOpen,
                hidden: !state.profileOpen,
              }"
            >
              <div
                class="py-1 rounded-md bg-white shadow-xs"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu"
              >
                <router-link
                  v-for="route in profileRoutes"
                  :key="route.route"
                  :to="{ name: route.route, params: { locale } }"
                  class="block px-4 py-2 capitalize text-md tracking-wider leading-5 text-gray-900 transition duration-150 ease-in-out"
                  role="menuitem"
                >
                  {{ $t(`navbar.profileRoute.${route.name}`) }}
                </router-link>
                <div class="w-full mt-2">
                  <div class="inline-flex">
                    <button
                      class="lang-button rounded-l-lg"
                      @click="() => (currentLocale = 'it')"
                      :class="{ active: currentLocale === 'it' }"
                    >
                      ita
                    </button>
                    <button
                      class="lang-button rounded-r-lg"
                      :class="{ active: currentLocale === 'en' }"
                      @click="() => (currentLocale = 'en')"
                    >
                      eng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      :class="{
        'hidden sm:hidden': !state.menuOpen,
      }"
    >
      <div class="px-2 pt-2 pb-3">
        <router-link
          v-for="route in navbarRoutes"
          :key="route.route"
          :to="{ name: route.route, params: { locale } }"
          class="block px-3 py-2 capitalize rounded-md text-base font-semibold tracking-widest focus:outline-none transition duration-150 ease-in-out text-gray-900"
        >
          {{ $t(`navbar.route.${route.name}`) }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { Dictionary } from "@/types/base";
import { image } from "@/instances/sanity";
import { getPlayer } from "@/services/authService";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { setLanguage } from "@/services/langService";

type State = {
  name: string;
  color: string;
  icon: string;
};

const availableStates: Dictionary<State> = {
  trump: { name: "trump", color: "bg-blue-500", icon: "far fa-heart" },
  secretHitler: {
    name: "secretHitler",
    color: "bg-red-400",
    icon: "fas fa-skull-crossbones",
  },
  default: { name: "lattanaGames", color: "bg-gray-600", icon: "" },
};

export default defineComponent({
  data() {
    return {
      publicPath: process.env.BASE_URL,
      state: {
        profileOpen: false,
        menuOpen: false,
      },
      player: getPlayer(),
      navbarRoutes: [
        { name: "trump", route: "trumpHistory" },
        { name: "secretHitler", route: "secretHitlerHistory" },
      ],
      profileRoutes: [
        { name: "profile", route: "profile" },
        { name: "logout", route: "logout" },
      ],
    };
  },
  setup() {
    const router = useRouter();
    const { locale } = useI18n({ useScope: "global" });

    const currentLocale = ref(locale.value);
    // sync to switch locale from router locale path
    watch(router.currentRoute, (route) => {
      currentLocale.value = route.params.locale as string;
    });

    watch(currentLocale, (val) => {
      setLanguage(val);
      router.push({
        name: router.currentRoute.value.name as string,
        params: { locale: val },
      });
    });

    return { currentLocale };
  },
  methods: {
    profileClick() {
      this.state.profileOpen = true;
      setTimeout(() => (this.state.profileOpen = false), 2000);
    },
    menuClick() {
      this.state.menuOpen = !this.state.menuOpen;
      setTimeout(() => (this.state.menuOpen = false), 2000);
    },
  },
  computed: {
    profileSrc(): string {
      return image(this.player?.profileImage ?? "", 300);
    },
    locale(): string {
      return this.$i18n.locale;
    },
    currentState(): State {
      for (const key in availableStates)
        if (this.$route.matched.find((r) => r.name === key))
          return availableStates[key];

      return availableStates.default;
    },
  },
});
</script>

<style>
.lang-button {
  @apply w-24 bg-white text-gray-900 font-bold border appearance-none focus:ring border-blue-600 outline-none tracking-widest;
}
.lang-button.active {
  @apply bg-blue-400;
}
</style>