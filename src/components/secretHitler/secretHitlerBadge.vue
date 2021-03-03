<template>
  <badge
    :text="$t(`secretHitler.roles.${role}`)"
    :background="
      role === secretHitlerRole.liberal ? 'bg-blue-200' : 'bg-red-200'
    "
    :textColor="
      role === secretHitlerRole.liberal ? 'text-blue-900' : 'text-red-900'
    "
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Badge from "../base/Badge.vue";
import { secretHitlerRole } from "@/constants/roleConstants";

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
      secretHitlerRole,
    };
  },
});
</script>

