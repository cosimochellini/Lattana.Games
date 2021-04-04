<template>
  <badge
    :text="text"
    :textColor="tailwind.base.text(win)"
    :background="tailwind.base.background(win)"
  />
</template>

<script lang="ts">
import Badge from "./Badge.vue";
import { useI18n } from "vue-i18n";
import { computed, defineComponent } from "vue";
import { tailwind } from "@/services/tailwind.service";

export default defineComponent({
  components: { Badge },
  props: {
    win: {
      type: Boolean,
      default: () => false,
    },
  },
  setup(props) {
    const i18n = useI18n();

    const text = computed(() =>
      props.win ? i18n.t("form.base.win") : i18n.t("form.base.lose")
    );

    return { text, tailwind };
  },
});
</script>

<style>
</style>