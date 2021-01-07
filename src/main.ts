import App from "./App.vue";
import router from "./router";
import { createApp } from "vue";
import toast, { PluginOptions, POSITION } from "vue-toastification";

import "./assets/tailwind.css";
import "vue-toastification/dist/index.css";

const toastOption: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
  showCloseButtonOnHover: true,
  hideProgressBar: true,
  pauseOnHover: true,
  transition: "Vue-Toastification__slideBlurred",
};

createApp(App)
  .use(router)
  .use(toast, toastOption)
  .mount("#app");
