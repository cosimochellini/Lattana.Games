<template>
  <badge
    :text="$t(`secretHitler.roles.${role}`)"
    :background="background"
    :textColor="textColor"
  />
</template>

<script lang="ts">
import Badge from "../base/Badge.vue";
import { computed, defineComponent } from "vue";
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
  setup(props) {
    const background = computed(() => {
      switch (props.role) {
        case secretHitlerRole.liberal:
          return "bg-blue-200";
        case secretHitlerRole.fascist:
          return "bg-red-200";
        default:
          return "bg-gray-400";
      }
    });
    const textColor = computed(() => {
      switch (props.role) {
        case secretHitlerRole.liberal:
          return "text-blue-900";
        case secretHitlerRole.fascist:
          return "text-red-900";
        default:
          return "text-black";
      }
    });
    return {
      textColor,
      background,
      secretHitlerRole,
    };
  },
});
</script>

