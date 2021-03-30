import { computed } from "vue";
import { reactiveStorage } from "./reactiveStorage.service";

const LS_LANGUAGE_STORE = "LS_LANGUAGE_STORE";

export const currentLanguage = reactiveStorage(LS_LANGUAGE_STORE, "it");

export const currentLocale = computed(
  () => `${currentLanguage.value}-${currentLanguage.value.toUpperCase()}`
); //it-IT
