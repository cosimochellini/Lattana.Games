import toast, { PluginOptions, POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

const toastOption: PluginOptions = {
  draggable: true,
  newestOnTop: true,
  pauseOnHover: true,
  draggablePercent: 0.6,
  hideProgressBar: true,
  showCloseButtonOnHover: true,
  position: POSITION.BOTTOM_RIGHT,
  transition: "Vue-Toastification__fade",
};

export { toast, toastOption };
