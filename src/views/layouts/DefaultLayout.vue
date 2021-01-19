<template>
  <navbar v-if="isAuthorized" />
  <router-view />
</template>

<script>
import Navbar from "@/components/base/Navbar.vue";
import { isAuthorized } from "@/services/authService";

export default {
  components: { Navbar },
  data() {
    return { isAuthorized: isAuthorized() };
  },
  watch: {
    $route: {
      handler() {
        this.isAuthorized = isAuthorized();
      },
      deep: true,
    },
  },
};
</script>

<style>
</style>