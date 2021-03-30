<template>
  <badge
    :text="formatter.smartRelativeTime(date, 1)"
    background="bg-gray-200"
  />
</template>

<script lang="ts">
import Badge from "./Badge.vue";
import { defineComponent } from "vue";
import { formatter } from "@/utils/formatters";

export default defineComponent({
  components: { Badge },
  props: {
    date: {
      type: [String, Date],
      required: true,
    },
  },
  setup() {
    return { formatter };
  },
});
</script>
