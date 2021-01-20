<template>
  <navbar v-if="isAuthorized" />
  <router-view />
</template>

<script>
import Navbar from "@/components/base/Navbar.vue";
import { isAuthorized } from "@/services/authService";

export default {
  components: { Navbar },
  setup() {
    return {
      isAuthorized: isAuthorized(),
    };
  },
};
</script>
