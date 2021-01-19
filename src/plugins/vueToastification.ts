import toast, { PluginOptions, POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

const toastOption: PluginOptions = {
  position: POSITION.BOTTOM_RIGHT,
  showCloseButtonOnHover: true,
  hideProgressBar: true,
  pauseOnHover: true,
  transition: "Vue-Toastification__slideBlurred",
};

export { toast, toastOption };
