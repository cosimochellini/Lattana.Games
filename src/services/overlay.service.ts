import mitt from "mitt";

const overlayEmitter = mitt();

enum overlayEnum {
  "show" = "show",
  "hide" = "hide",
}

export const overlay = {
  show() {
    overlayEmitter.emit(overlayEnum.show);
    return true;
  },

  hide() {
    overlayEmitter.emit(overlayEnum.hide);
    return true;
  },

  onShow(func: () => void) {
    overlayEmitter.on(overlayEnum.show, func);
    return this;
  },
  onHide(func: () => void) {
    overlayEmitter.on(overlayEnum.hide, func);
    return this;
  },
};
