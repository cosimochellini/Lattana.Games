import { nextTick, unref } from "vue";
import { createI18n } from "vue-i18n";
import { currentLanguage } from "@/services/language.service";

export const SUPPORT_LOCALES = ["en", "it"];

export async function setupI18n() {
  const initialLanguage = unref(currentLanguage);

  const i18n = createI18n({
    globalInjection: true,
    legacy: false,
    locale: initialLanguage,
    fallbackLocale: "it",
    messages: {
      [initialLanguage]: await import(
        /* webpackChunkName: "locale-[request]" */ `../locales/${initialLanguage}.json`
      ),
    },
  });

  setI18nLanguage(i18n, initialLanguage);

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
