import { I18n } from "vue-i18n";

type currentLocal = I18n<{ [x: string]: any }, unknown, unknown, false>;

export let i18n: currentLocal;

export const setI18n = (ref: currentLocal) => (i18n = ref);
