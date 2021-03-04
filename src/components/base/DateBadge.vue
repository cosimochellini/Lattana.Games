<template>
  <badge :text="smartRelativeTime(date, 1)" background="bg-gray-200" />
</template>

<script lang="ts">
import Badge from "./Badge.vue";
import { defineComponent } from "vue";
import { smartRelativeTime } from "@/utils/formatters";

export default defineComponent({
  components: { Badge },
  props: {
    date: {
      type: [String, Date],
      required: true,
    },
  },
  setup() {
    return {
      smartRelativeTime,
    };
  },
});
</script>
