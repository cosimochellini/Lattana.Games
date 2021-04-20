import { ref, watch } from "vue";

export const reactiveStorage = <T>(
  localStoragePath: string,
  defaultValue: T
) => {
  const initialValue: T = getLsRawValue(localStoragePath) ?? defaultValue;

  const lsValue = ref(initialValue);

  watch(lsValue, (newValue) => {
    localStorage.setItem(localStoragePath, JSON.stringify(newValue));
  });

  return lsValue;
};

const getLsRawValue = <T>(localStoragePath: string): T | null => {
  try {
    return JSON.parse(localStorage.getItem(localStoragePath) ?? "");
  } catch (error) {
    return null;
  }
};
