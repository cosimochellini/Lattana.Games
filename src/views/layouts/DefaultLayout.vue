<template>
  <navbar v-if="userAuthorized" />
  <router-view />
</template>

<script>
import Navbar from "@/components/base/Navbar.vue";
import { isAuthorized } from "@/services/authService";
import { ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

export default {
  components: { Navbar },
  setup() {
    const userAuthorized = ref(isAuthorized());

    onBeforeRouteUpdate(() => (userAuthorized.value = isAuthorized()));

    return {
      userAuthorized,
    };
  },
};
</script>
