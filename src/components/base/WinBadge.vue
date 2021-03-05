<template>
  <badge :text="text" :textColor="textColor" :background="background" />
</template>

<script lang="ts">
import Badge from "./Badge.vue";
import { useI18n } from "vue-i18n";
import { computed, defineComponent } from "vue";

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

    const textColor = computed(() =>
      props.win ? "text-green-900" : "text-red-900"
    );

    const background = computed(() =>
      props.win ? "bg-green-200" : "bg-red-200"
    );

    return {
      text,
      textColor,
      background,
    };
  },
});
</script>

<style>
</style>