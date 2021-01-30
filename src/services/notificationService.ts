import { TYPE, useToast } from "vue-toastification";
import { ToastOptions } from "vue-toastification/dist/types/types";

declare type notifyOptions = ToastOptions & {
  type?: TYPE.INFO | undefined;
};
const getErrorMessage = (error: any) => {
  if (!error) return "";

  if (typeof error === "string") return error;

  if (typeof error.message === "string") return error.message;
};

export const notificationService = {
  notify(notification: string, option: notifyOptions | undefined = undefined) {
    return useToast().info(notification, option);
  },
  success(notification: string) {
    return useToast().success(notification);
  },
  warning(notification: string) {
    return useToast().warning(notification);
  },
  danger(error: any) {
    return useToast().error(getErrorMessage(error));
  },
};
