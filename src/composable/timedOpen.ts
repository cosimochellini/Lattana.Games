import { ref, watch } from "vue";

export const useTimedOpen = (
  timeInterval: number = 2000,
  startOpen: boolean = false
) => {
  let interval: number;
  const isOpen = ref(startOpen);

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  watch(isOpen, (value) =>
    value
      ? (interval = setTimeout(() => (isOpen.value = false), timeInterval))
      : clearTimeout(interval)
  );
  return { isOpen, toggle };
};
