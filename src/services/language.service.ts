import { computed } from "vue";
import { reactiveStorage } from "./reactiveStorage.service";

export const currentLanguage = reactiveStorage(
  "LS_LANGUAGE_STORE",
  "en"
);

export const currentLocale = computed(
  () => `${currentLanguage.value}-${currentLanguage.value.toUpperCase()}`
); //it-IT
