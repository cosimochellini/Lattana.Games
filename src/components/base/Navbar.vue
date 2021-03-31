<template>
  <nav class="rounded-b-md" :class="currentState.color">
    <div class="max-w-7xl mx-auto px-2">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-900 focus:bg-transparent transition duration-150 ease-in-out"
            @click.stop="toggleNavbar"
          >
            <i class="far fa-bars" v-if="!state.navbarOpen"></i>
            <i class="far fa-times" v-else></i>
          </button>
        </div>
        <div
          class="flex-1 flex items-center place-items-center content-center justify-center sm:items-stretch sm:justify-start justify-items-center text-gray-900"
        >
          <span
            class="font-semibold leading-3 text-2xl tracking-widest capitalize md:pt-1"
          >
            <span class="md:hidden">
              {{ $t(`navbar.route.${currentState.name}`) }}
            </span>
            <span class="hidden md:block"> Lattana Games </span>
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
                class="capitalize px-3 py-2 rounded-md text-md font-medium tracking-widest text-lg leading-5 focus:outline-none transition duration-150 ease-in-out text-gray-900 hover:text-white"
                :class="bindRouterLink(route.name, index)"
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
              >
                <img
                  @click="toggleProfile"
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
              <div class="py-1 rounded-md bg-white shadow-xs" role="menu">
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
                      @click="() => (currentLanguage = 'it')"
                      :class="{ active: currentLanguage === 'it' }"
                    >
                      ita
                    </button>
                    <button
                      class="lang-button rounded-r-lg"
                      :class="{ active: currentLanguage === 'en' }"
                      @click="() => (currentLanguage = 'en')"
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
        'hidden sm:hidden': !state.navbarOpen,
      }"
    >
      <div class="px-2 pt-2 pb-3">
        <router-link
          v-for="route in navbarRoutes"
          :key="route.route"
          :to="{ name: route.route, params: { locale } }"
          @click.passive="toggleNavbar"
          class="block px-3 py-2 capitalize rounded-md text-base font-semibold tracking-widest focus:outline-none transition duration-150 ease-in-out text-gray-900"
        >
          {{ $t(`navbar.route.${route.name}`) }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { useRouter } from "vue-router";
import { image } from "@/instances/sanity";
import { Dictionary } from "@/types";
import { auth } from "@/services/auth.service";
import { useTimedOpen } from "@/composable/timedOpen";
import { defineComponent, reactive, watch } from "vue";
import { currentLanguage } from "@/services/language.service";

type State = {
  name: string;
  color: string;
  icon: string;
};

const availableStates: Dictionary<State> = {
  trump: { name: "trump", color: "bg-blue-500", icon: "fas fa-spade" },
  secretHitler: {
    name: "secretHitler",
    color: "bg-red-400",
    icon: "fad fa-snake",
  },
  default: { name: "lattanaGames", color: "bg-gray-600", icon: "" },
};

export default defineComponent({
  data() {
    return {
      publicPath: process.env.BASE_URL,
      player: auth.currentPlayer,
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

    // sync to switch locale from router locale path
    watch(router.currentRoute, (route) => {
      currentLanguage.value = route.params.locale as string;
    });

    watch(currentLanguage, (val) => {
      currentLanguage.value = val;
      router.push({
        name: router.currentRoute.value.name as string,
        params: { locale: val },
      });
    });

    const { isOpen: navbarOpen, toggle: toggleNavbar } = useTimedOpen();
    const { isOpen: profileOpen, toggle: toggleProfile } = useTimedOpen();

    const state = reactive({ navbarOpen, profileOpen });

    return { currentLanguage, state, toggleNavbar, toggleProfile };
  },
  mounted() {
    auth.onPlayerUpdate(() => {
      this.player = auth.editablePlayer;
    });
  },
  methods: {
    bindRouterLink(route: string, index: number) {
      const isActive = this.$route.matched.some((x) => x.path.includes(route));

      return {
        "ml-4": !!index,
        "bg-opacity-20 bg-black": isActive,
      };
    },
  },
  computed: {
    profileSrc(): string {
      return image(this.player.profileImage, 500);
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