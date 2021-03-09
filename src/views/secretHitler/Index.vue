<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <bottom-bar :game="'secretHitler'" v-once />
</template>

<script lang="ts">
import BottomBar from "@/components/base/BottomBar.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: { BottomBar },
});
</script>

<style>
</style>