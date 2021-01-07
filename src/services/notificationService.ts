import { TYPE, useToast } from "vue-toastification";
import { ToastOptions } from "vue-toastification/dist/types/types";

declare type notifyOptions = ToastOptions & {
  type?: TYPE.INFO | undefined;
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
  danger(notification: string) {
    return useToast().error(notification);
  },
};
