<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <bottom-bar :game="currentGame" v-once />
</template>

<script lang="ts">
import BottomBar from "@/components/base/BottomBar.vue";
import { games } from "@/constants";
import { defineComponent } from "vue";

export default defineComponent({
  components: { BottomBar },
  name: "SecretHitlerIndex",
  setup() {
    const currentGame = games.secretHitler;
    return {
      currentGame,
    };
  },
});
</script>

<style>
</style>
