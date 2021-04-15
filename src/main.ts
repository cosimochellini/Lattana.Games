import App from "./App.vue";
import { createApp } from "vue";
import { setupI18n } from "./plugins/i18n";
import { setupRouter } from "./plugins/router";
import { toast, toastOption } from "./plugins/vueToastification";

import "./assets/fa";
import "./assets/tailwind.css";

setupI18n()
  .then((i18n) =>
    createApp(App)
      .use(i18n)
      .use(setupRouter())
      .use(toast, toastOption)
      .mount("#app")
  )
  .catch(console.warn);
