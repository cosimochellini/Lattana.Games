import mitt from "mitt";

const overlayEmitter = mitt();

enum overlayEnum {
  "show" = "show",
  "hide" = "hide",
}

export const overlayService = {
  showOverlay() {
    overlayEmitter.emit(overlayEnum.show);
    return true;
  },
  hideOverlay() {
    overlayEmitter.emit(overlayEnum.hide);
    return true;
  },

  onShow(func: () => void) {
    overlayEmitter.on(overlayEnum.show, func);
  },
  onHide(func: () => void) {
    overlayEmitter.on(overlayEnum.hide, func);
  },
};
