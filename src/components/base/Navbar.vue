<template>
  <nav class="rounded-b-md transition duration-500" :class="actualState.color">
    <div class="max-w-7xl mx-auto px-2 md:px-0">
      <div class="relative flex items-center justify-between h-14 sm:h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-900 focus:bg-transparent transition duration-150 ease-in-out"
            @click.stop="toggleNavbar"
          >
            <i class="far fa-bars" v-if="!state.navbarOpen" />
            <i class="far fa-times" v-else />
          </button>
        </div>
        <div
          class="flex-1 flex items-center place-items-center content-center justify-center sm:items-stretch sm:justify-start justify-items-center text-gray-900"
        >
          <div
            class="font-semibold leading-3 text-2xl tracking-widest capitalize px-3 py-2"
          >
            <div class="md:hidden">
              <span
                v-t="'navbar.route.' + actualState.name"
                class="transition duration-500"
              />

              <i class="w-auto" :class="`ml-1 text-2xl ${actualState.icon}`" />
            </div>
            <div class="hidden md:block">
              Lattana Games
              <i class="w-auto" :class="`ml-1 text-2xl ${actualState.icon}`" />
            </div>
          </div>

          <div class="hidden sm:block sm:ml-6">
            <div class="flex">
              <router-link
                v-for="(route, index) in navbarConfig.navbarRoutes"
                :key="route.route"
                :to="{ name: route.route, params: { locale } }"
                class="capitalize px-3 py-2 rounded-md text-md font-medium tracking-widest text-lg leading-5 focus:outline-none transition duration-150 ease-in-out text-gray-900 hover:text-white"
                :class="bindRouterLink(route.name, index)"
                v-t="'navbar.route.' + route.name"
              />
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
                  v-for="route in navbarConfig.profileRoutes"
                  :key="route.route"
                  :to="{ name: route.route, params: { locale } }"
                  class="block px-4 py-2 capitalize text-md tracking-wider leading-5 text-gray-900 transition duration-150 ease-in-out"
                  role="menuitem"
                  v-t="'navbar.profileRoute.' + route.name"
                />
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
          v-for="route in navbarConfig.navbarRoutes"
          :key="route.route"
          :to="{ name: route.route, params: { locale } }"
          @click.passive="toggleNavbar"
          class="block px-3 py-2 capitalize rounded-md text-base font-semibold tracking-widest focus:outline-none transition duration-150 ease-in-out text-gray-900"
          v-t="'navbar.route.' + route.name"
        />
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { Dictionary } from "@/types";
import { useRouter } from "vue-router";
import { image } from "@/instances/sanity";
import { auth } from "@/services/auth.service";
import { ApplicationState } from "@/types/shared";
import navbarConfig from "@/configuration/navbar";
import { useTimedOpen } from "@/composable/timedOpen";
import { defineComponent, reactive, watch } from "vue";
import { currentLanguage } from "@/services/language.service";

export default defineComponent({
  data() {
    return {
      navbarConfig,
      player: auth.currentPlayer,
      actualState: navbarConfig.states.default,

      leavingState: {} as ApplicationState,
    };
  },
  setup() {
    const router = useRouter();

    // sync to switch locale from router locale path
    watch(router.currentRoute, (route) => {
      currentLanguage.value = route.params.locale as string;
    });

    watch(currentLanguage, (locale) => {
      currentLanguage.value = locale;
      router.push({
        name: router.currentRoute.value.name as string,
        params: { locale },
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
    currentState(): ApplicationState {
      for (const key in navbarConfig.states)
        if (this.$route.matched.find((r) => r.name === key))
          return navbarConfig.states[key];

      return navbarConfig.states.default;
    },
    bindNavbarClasses(): Dictionary<boolean> {
      const ret = {
        transition: true,
        [this.actualState.color]: true,
        "duration-500": true,
      };

      return ret;
    },
  },
  watch: {
    currentState: {
      handler(_: ApplicationState, oldState: ApplicationState | null) {
        const defaultState = navbarConfig.states.default;

        this.leavingState = oldState ?? defaultState;

        const timeout =
          this.leavingState.name === defaultState.name ? 1000 : 300;

        setTimeout(() => (this.actualState = this.currentState), timeout);
      },
      immediate: true,
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