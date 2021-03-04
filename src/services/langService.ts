import { computed, ref, watch } from "vue";

const LS_LANGUAGE_STORE = "LS_LANGUAGE_STORE";

export const currentLanguage = ref(
  localStorage.getItem(LS_LANGUAGE_STORE) ?? "it"
);

export const currentLocale = computed(
  () => `${currentLanguage.value}-${currentLanguage.value.toUpperCase()}`
);

watch(currentLanguage, (value) =>
  localStorage.setItem(LS_LANGUAGE_STORE, value)
);
