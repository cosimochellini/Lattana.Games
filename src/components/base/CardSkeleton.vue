<template>
  <!-- card -->
  <div class="bg-white rounded-lg shadow-2xl base-card w-full" ref="target">
    <!-- image -->
    <div
      class="h-32 bg-gray-200 rounded-tr-lg rounded-tl-lg animate-pulse"
    ></div>

    <div class="p-5">
      <!-- title -->
      <div class="h-6 rounded-sm bg-gray-200 animate-pulse mb-4"></div>

      <!-- content -->
      <div class="grid grid-cols-4 gap-1">
        <div class="col-span-3 h-4 rounded-sm bg-gray-200 animate-pulse"></div>
        <div class="h-4 rounded-sm bg-gray-200 animate-pulse"></div>

        <div class="col-span-2 h-4 rounded-sm bg-gray-200 animate-pulse"></div>
        <div class="col-span-2 h-4 rounded-sm bg-gray-200 animate-pulse"></div>

        <div class="h-4 rounded-sm bg-gray-200 animate-pulse"></div>
        <div class="col-span-3 h-4 rounded-sm bg-gray-200 animate-pulse"></div>
        <div class="col-span-2 h-4 rounded-sm bg-gray-200 animate-pulse"></div>
        <div class="h-4 rounded-sm bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, watch, onUnmounted } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

export default defineComponent({
  name: "card-skeleton",
  emits: ["visible"],
  setup(props, context) {
    const target = ref(null);
    const targetIsVisible = ref(false);

    const { stop } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
      targetIsVisible.value = isIntersecting;
    });

    onUnmounted(() => stop());

    watch(targetIsVisible, (isVisible) => {
      isVisible && context.emit("visible");
    });

    return {
      target,
      targetIsVisible,
    };
  },
});
</script>