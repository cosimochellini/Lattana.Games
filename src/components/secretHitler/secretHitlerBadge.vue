<template>
  <badge
    :text="$t(`secretHitler.roles.${role}`)"
    :textColor="tailwind.secretHitler.bindTextColor(role)"
    :background="tailwind.secretHitler.bindBackground(role)"
  />
</template>

<script lang="ts">
import Badge from "../base/Badge.vue";
import { defineComponent } from "vue";
import { tailwind } from "@/services/tailwind.service";

export default defineComponent({
  name: "secretHitlerBadge",
  components: { Badge },
  props: {
    role: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {
      tailwind,
    };
  },
});
</script>

