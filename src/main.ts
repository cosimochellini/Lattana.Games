import App from "./App.vue";
import { createApp } from "vue";
import { setupI18n } from "./plugins/i18n";
import { setupRouter } from "./plugins/router";
import { toast, toastOption } from "./plugins/vueToastification";

import "./assets/tailwind.css";

const i18n = setupI18n();
const router = setupRouter(i18n);

createApp(App)
  .use(i18n)
  .use(router)
  .use(toast, toastOption)
  .mount("#app");
