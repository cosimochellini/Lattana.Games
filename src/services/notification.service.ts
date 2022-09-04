import { translate } from "@/instances/i18n";
import { TYPE, useToast } from "vue-toastification";
import { ToastOptions } from "vue-toastification/dist/types/types";

declare type notifyOptions = ToastOptions & {
  type?: TYPE.INFO | undefined;
};

const getErrorMessage = (error: any) => {
  if (!error) return "";

  if (typeof error === "string") return error;

  if (typeof error.message === "string") return error.message;

  return error.toString() ?? "";
};

export const notification = {
  notify(notification: string, option: notifyOptions | undefined = undefined) {
    return useToast().info(notification, option);
  },
  success(translation: string) {
    return useToast().success(translate(translation));
  },
  warning(translation: string) {
    return useToast().warning(translate(translation));
  },
  danger(error: any) {
    return useToast().error(getErrorMessage(error));
  },
} as const;
