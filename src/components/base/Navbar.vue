<template>
  <nav class="bg-gray-800">
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
          <!-- Mobile menu button-->
          <button
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-purple-800 hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
            aria-label="Main menu"
            aria-expanded="false"
            @click.stop="menuClick"
          >
            <!-- Icon when menu is closed. -->
            <!--
            Heroicon name: menu

            Menu open: "hidden", Menu closed: "block"
          -->
            <svg
              class="h-6 w-6"
              :class="{
                block: !state.profileOpen,
                hidden: state.profileOpen,
              }"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <!-- Icon when menu is open. -->
            <!--
            Heroicon name: x

            Menu open: "block", Menu closed: "hidden"
          -->
            <svg
              class="h-6 w-6"
              :class="{
                block: state.profileOpen,
                hidden: !state.profileOpen,
              }"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div
          class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
        >
          <div class="flex-shrink-0">
            <img
              class="block h-8 w-auto"
              :src="`${publicPath}heart.svg`"
              alt="Workflow logo"
            />
          </div>
          <div class="hidden sm:block sm:ml-6">
            <div class="flex">
              <router-link
                v-for="(route, index) in navbarRoutes"
                :key="route.route"
                :to="{ name: route.route, params: { locale } }"
                :class="getDesktopMenuClass(route.route, index)"
              >
                {{ route.name }}
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
                  class="h-8 w-8 rounded-full"
                  :src="profileSrc"
                  alt="User Profile"
                />
              </button>
            </div>
            <!--
            Profile dropdown panel, show/hide based on dropdown state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          -->
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
                  class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                  role="menuitem"
                >
                  {{ route.name }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--
    Mobile menu, toggle classes based on menu state.

    Menu open: "block", Menu closed: "hidden"
  -->
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
          class="block px-3 py-2 rounded-md text-base font-medium focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out text-gray-300 hover:text-white hover:bg-gray-700"
        >
          {{ route.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { urlFor } from "@/instances/sanity";
import { getPlayer } from "@/services/authService";

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
        { name: "Nuovo match", route: "trumpNew" },
        { name: "Storico", route: "trumpHistory" },
        { name: "Statistiche", route: "trumpStats" },
      ],
      profileRoutes: [
        { name: "Your Profile", route: "profile" },
        { name: "Logout", route: "logout" },
      ],
    };
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
    getDesktopMenuClass(route: string, index: number): string {
      const classes = [
        "px-3 py-2 rounded-md text-sm font-medium leading-5 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out",
      ];

      if (this.$route.path === route) classes.push(`text-white bg-gray-900`);
      else classes.push(`text-gray-300 hover:text-white hover:bg-gray-700`);

      if (index === 0) classes.push(`ml-4`);

      return classes.join(" ");
    },
  },
  computed: {
    profileSrc(): string {
      return (
        urlFor(this.player?.profileImage ?? "")
          .maxWidth(200)
          .width(200) //todo ottimizzare l'immagine
          .url() ?? ""
      );
    },
    locale(): string {
      return this.$i18n.locale;
    },
  },
});
</script>

<style>
</style>