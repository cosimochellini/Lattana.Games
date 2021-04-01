import { ref, watch } from "vue";

export const reactiveStorage = <T>(
  localStoragePath: string,
  defaultValue: T
) => {
  const initialValue = getLsRawValue(localStoragePath, defaultValue);
  const lsValue = ref(initialValue);

  watch(lsValue, (newValue) => {
    localStorage.setItem(localStoragePath, JSON.stringify(newValue));
  });

  return lsValue;
};

const getLsRawValue = <T>(localStoragePath: string, defaultValue: T): T => {
  try {
    return (
      JSON.parse(localStorage.getItem(localStoragePath) ?? "") ?? defaultValue
    );
  } catch (error) {
    return defaultValue;
  }
};
