import App from "./App.vue";
import { createApp } from "vue";
import { setupRouter } from "./plugins/router";
import { toast, toastOption } from "./plugins/vueToastification";

import "./assets/tailwind.css";
import { DEFAULT_LOCALE, setupI18n } from "./plugins/i18n";

import it from "./locales/it.json";

const i18n = setupI18n({
  globalInjection: true,
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { it },
});
const router = setupRouter(i18n);

createApp(App)
  .use(i18n)
  .use(router)
  .use(toast, toastOption)
  .mount("#app");
