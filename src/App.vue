<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <overlay v-if="showOverlay" />
</template>

<script lang="ts">
import Overlay from "./components/base/Overlay.vue";
import { defineComponent, onMounted, ref } from "vue";
import { overlayService } from "./services/overlayService";

export default defineComponent({
  components: { Overlay },
  setup() {
    const showOverlay = ref(false);

    onMounted(() => {
      overlayService.onShow(() => (showOverlay.value = true));
      overlayService.onHide(() => (showOverlay.value = false));
    });

    return {
      showOverlay,
    };
  },
});
</script>

<style>
body {
  @apply bg-gradient-to-r from-gray-200 to-gray-300 h-full;
}
</style>
