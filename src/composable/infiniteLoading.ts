import { computed, nextTick, ref, UnwrapRef } from "vue";
import { groq, GroqTypes } from "@/utils/GroqQueryBuilder";
import { notification } from "@/services/notification.service";

type InfinityLoadingOptions<T> = {
  page: number;
  pageSize: number;
  onReset: (items: UnwrapRef<T[]>) => void;
  onResponse: (items: UnwrapRef<T[]>) => void;
  onFetch: (qb: GroqTypes["QueryBuilder"]) => void;
};

export const useInfiniteLoading = <T>(
  query: GroqTypes["QueryBuilder"],
  options: Partial<InfinityLoadingOptions<T>> | null = null
) => {
  const isLoading = ref(true);
  const items = ref([] as T[]);
  const moreDataAvailable = ref(true);

  const pagination = new groq.PaginationBuilder(
    options?.page,
    options?.pageSize
  );
  const resetMatches = () => {
    pagination.resetPage();
    options?.onReset?.(items.value);
    items.value = [];
    moreDataAvailable.value = true;
    return true;
  };

  const getMoreData = (reset: boolean = false) => {
    isLoading.value = true;

    reset && resetMatches();

    options?.onFetch?.(query);

    query
      .get(pagination.next())
      .fetch<UnwrapRef<T[]>>() //fix to trick TS to accept the [...value,...response]
      .then(async(response) => {
        options?.onResponse?.(response);

        items.value = [...items.value, ...response];

        moreDataAvailable.value = false;

        await nextTick(() => {
          moreDataAvailable.value = pagination.shouldContinue(response);
        });
      })
      .catch(notification.danger)
      .finally(() => (isLoading.value = false));
  };

  const emptyResult = computed(() => !isLoading.value && !items.value.length);

  return {
    items,
    isLoading,
    emptyResult,
    getMoreData,
    resetMatches,
    moreDataAvailable,
  };
};
