import { onActivated } from "vue";
import { useRoute } from "vue-router";

const REFRESH_PROPERTY = "refresh";

export const useRouterRefresh = (
  func: () => unknown,
  hookOnActivated: boolean = true
) => {
  const route = useRoute();

  const watchRefresh = () => route.query[REFRESH_PROPERTY] && func();

  hookOnActivated && onActivated(watchRefresh);

  return { watchRefresh };
};

export const queryRefresh = { [REFRESH_PROPERTY]: "true" };
