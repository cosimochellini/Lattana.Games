<template>
  <badge :text="recentDayFormatter(date)" background="bg-gray-200" />
</template>

<script lang="ts">
import Badge from "./Badge.vue";
import { defineComponent } from "vue";
import { recentDayFormatter } from "@/utils/formatters";

export default defineComponent({
  components: { Badge },
  props: {
    date: {
      type: String,
      required: true,
    },
  },
  setup() {
    return { recentDayFormatter };
  },
});
</script>
