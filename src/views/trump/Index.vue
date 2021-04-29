<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <bottom-bar :game="currentGame" v-once />
</template>

<script lang="ts">
import { games } from "@/constants";
import { defineComponent } from "vue";
import BottomBar from "@/components/base/BottomBar.vue";

export default defineComponent({
  components: { BottomBar },
  setup() {
    const currentGame = games.trump;

    return { currentGame };
  },
});
</script>
