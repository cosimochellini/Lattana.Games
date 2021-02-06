import { nextTick } from "vue";
import { createI18n } from "vue-i18n";
import it from "../locales/it.json";

export const SUPPORT_LOCALES = ["en", "it"];
export const DEFAULT_LOCALE = "it";

export function setupI18n() {
  const i18n = createI18n({
    globalInjection: true,
    legacy: false,
    locale: DEFAULT_LOCALE,
    fallbackLocale: DEFAULT_LOCALE,
    messages: { it },
  });

  setI18nLanguage(i18n, DEFAULT_LOCALE);

  return i18n;
}

export function setI18nLanguage(i18n: any, locale: string) {
  i18n.global.locale.value = locale;

  /**
   * NOTE:
   * If you need to specify the language setting for headers, such as the `fetch` API, set it here.
   * The following is an example for axios.
   *
   * axios.defaults.headers.common['Accept-Language'] = locale
   */
  document.querySelector("html")?.setAttribute("lang", locale);
}

export async function loadLocaleMessages(i18n: any, locale: string) {
  // load locale messages with dynamic import
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `../locales/${locale}.json`
  );

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default);

  return nextTick();
}