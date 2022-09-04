import { I18n } from "vue-i18n";

type currentLocal = I18n<{ [x: string]: any }, {}, {}, string, false>;

export let i18n: currentLocal;

export const setI18n = (ref: currentLocal) => (i18n = ref);

export const translate = (key: string): string => {
  // @ts-ignore
  return i18n.global.t(key);
};
