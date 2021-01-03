let globalInstace: any;

export const setGlobalInstace = (i: any) => (globalInstace = i);

const internalNotify = (notification: Notification) => {
  const component = globalInstace?.$refs?.notification as any;
  return component.call(notification);
};

export const notificationService = {
  notify(notification: Notification) {
    internalNotify(notification);
  },
  success(notification: string) {
    internalNotify(new Notification(notification, notificationType.success));
  },
  danger(notification: Notification) {
    notification.type = notificationType.danger;
    internalNotify(notification);
  },
};
export const enum notificationType {
  success = "success",
  info = "info",
  danger = "danger",
  error = "error",
}

export class Notification {
  title: String;
  message: String = "";
  type: notificationType;

  constructor(
    title: string,
    type: notificationType = notificationType.info,
    body: string = ""
  ) {
    this.title = title;
    this.type = type;
    this.message = body;
  }
}
