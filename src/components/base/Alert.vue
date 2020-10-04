<template>
  <div
    class="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 clearfix"
    role="alert"
  >
    <p class="font-bold">
      <slot name="title"> Be Warned </slot>
    </p>
    <p>
      <slot name="description"> Something not ideal might be happening. </slot>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Alert",
});
</script>

<style>
</style>