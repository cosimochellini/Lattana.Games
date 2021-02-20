import App from "./App.vue";
import { createApp } from "vue";
import { setupI18n } from "./plugins/i18n";
import { setupRouter } from "./plugins/router";
import { toast, toastOption } from "./plugins/vueToastification";

import "./assets/tailwind.css";

const loader = async () => {
  const i18n = await setupI18n();
  const router = setupRouter(i18n);

  createApp(App)
    .use(i18n)
    .use(router)
    .use(toast, toastOption)
    .mount("#app");
};

loader().catch(console.error);
