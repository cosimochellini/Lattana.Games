import { Dictionary } from "@/types";
import { reactiveStorage } from "./reactiveStorage.service";

declare type color = string;

const currentColors = reactiveStorage<Dictionary<color>>("LS_COLOR", {});

const getColor = (value: string) => {
  if (!currentColors.value[value]) {
    currentColors.value[value] = "#" + intToRGB(hashCode(value));
  }

  return currentColors.value[value];
};

const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

const intToRGB = (i: number) => {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();

  return "00000".substring(0, 6 - c.length) + c;
};

export { getColor };
