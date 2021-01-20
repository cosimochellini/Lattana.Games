<template>
  <router-view />
</template>

<script lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  setup() {
    const router = useRouter();
    const { locale } = useI18n({ useScope: "global" });
    /**
     * select locale value for language select form
     *
     * If you use the vue-i18n composer `locale` property directly, it will be re-rendering component when this property is changed,
     * before dynamic import was used to asynchronously load and apply locale messages
     * To avoid this, use the anoter locale reactive value.
     */
    const currentLocale = ref(locale.value);
    // sync to switch locale from router locale path
    watch(router.currentRoute, (route) => {
      currentLocale.value = route.params.locale as string;
    });
    /**
     * when change the locale, go to locale route
     *
     * when the changes are detected, load the locale message and set the language via vue-router navigation guard.
     * change the vue-i18n locale too.
     */
    watch(currentLocale, (val) => {
      router.push({
        name: router.currentRoute.value.name as string,
        params: { locale: val },
      });
    });
  },
  mounted() {},
});
</script>

<style>
body {
  @apply bg-gradient-to-r from-gray-200 to-gray-400 h-full;
}
</style>
