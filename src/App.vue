<template>
  <navbar v-if="isAuthorized" />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "@/components/base/Navbar.vue";
import { isAuthorized } from "./services/authService";

export default defineComponent({
  components: {
    Navbar,
  },
  data() {
    return {
      isAuthorized: isAuthorized(),
    };
  },
  mounted() {},
  watch: {
    $route: {
      handler() {
        this.isAuthorized = isAuthorized();
      },
      deep: true,
    },
  },
});
</script>

<style>
body {
  @apply bg-gradient-to-r from-gray-200 to-gray-400 h-full;
}
</style>
