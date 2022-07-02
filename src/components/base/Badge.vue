<template>
  <span
    class="text-xs font-semibold inline-block py-1 px-2 rounded uppercase last:mr-0 mr-1 tracking-wider"
    :class="background + ' ' + textColor"
    v-text="text"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BadgeComponent",
  props: {
    text: {
      type: String,
      required: true,
    },
    background: {
      type: String,
      default: () => "bg-blue-200",
    },
    textColor: {
      type: String,
      default: () => "text-black",
    },
  },
});
</script>
