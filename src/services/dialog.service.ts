import mitt from "mitt";

const dialogEmitter = mitt();

enum dialogEnum {
  confirm = "confirm",
  closeConfirm = "closeConfirm",
}
export enum dialogType {
  info,
  warning,
  danger,
}

export interface DialogOption {
  title: string;
  type: dialogType;

  description?: string;

  buttons?: Partial<{
    confirm: string;
    cancel: string;
  }>;

  ignoreClickOutside?: boolean;
}

export const dialog = {
  confirm(option: DialogOption) {
    dialogEmitter.emit(dialogEnum.confirm, option);

    return new Promise<boolean>((resolve) => {
      dialogEmitter.on(dialogEnum.closeConfirm, (result) =>
        resolve(result as boolean)
      );
    });
  },
  closeConfirm(result: boolean) {
    dialogEmitter.emit(dialogEnum.closeConfirm, result);
  },

  onConfirm(func: (option: DialogOption) => void) {
    dialogEmitter.on(dialogEnum.confirm, (op) => func(op as DialogOption));
  },
};
