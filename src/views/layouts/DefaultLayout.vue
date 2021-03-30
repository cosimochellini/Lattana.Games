<template>
  <navbar v-if="userAuthorized" />
  <router-view />
</template>

<script>
import { ref } from "vue";
import { auth } from "@/services/auth.service";
import { onBeforeRouteUpdate } from "vue-router";
import Navbar from "@/components/base/Navbar.vue";

export default {
  components: { Navbar },
  setup() {
    const userAuthorized = ref(auth.isAuthorized());

    onBeforeRouteUpdate(() => (userAuthorized.value = auth.isAuthorized()));

    return { userAuthorized };
  },
};
</script>
