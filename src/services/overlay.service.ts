import mitt from "mitt";

const overlayEmitter = mitt();

enum overlayEnum {
  "show" = "show",
  "hide" = "hide",
}

export const overlay = {
  show() {
    overlayEmitter.emit(overlayEnum.show);
    return this;
  },

  hide() {
    overlayEmitter.emit(overlayEnum.hide);
    return this;
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
