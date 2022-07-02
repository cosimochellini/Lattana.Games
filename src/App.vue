<template>
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <DialogComponent />
  <overlay v-if="showOverlay" />
</template>

<script lang="ts">
import DialogComponent from "./components/base/Dialog.vue";
import { overlay } from "./services/overlay.service";
import { defineAsyncComponent, defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  components: {
    overlay: defineAsyncComponent(
      () => import("@/components/base/Overlay.vue")
    ),
    DialogComponent,
  },
  setup() {
    const showOverlay = ref(false);

    onMounted(() => {
      overlay
        .onShow(() => (showOverlay.value = true))
        .onHide(() => (showOverlay.value = false));
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
