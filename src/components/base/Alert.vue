<template>
  <div
    class="bg-yellow-200 border-l-4 border-yellow-700 text-yellow-700 p-4 clearfix rounded-md"
    role="alert"
  >
    <p class="font-bold tracking-wider">
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
  name: "AlertComponent",
});
</script>

<style>
</style>
