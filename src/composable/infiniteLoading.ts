import { nextTick, ref, UnwrapRef } from "vue";
import { groq, GroqTypes } from "@/utils/GroqQueryBuilder";
import { notification } from "@/services/notification.service";

type InfinityLoadingOptions<T> = {
  page: number;
  pageSize: number;
  onReset: (items: UnwrapRef<T[]>) => void;
  onResponse: (items: UnwrapRef<T[]>) => void;
  onFetch: (qb: GroqTypes.QueryBuilderType) => void;
};

export const useInfiniteLoading = <T>(
  query: GroqTypes.QueryBuilderType,
  options: Partial<InfinityLoadingOptions<T>> | null = null
) => {
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
    reset && resetMatches();

    options?.onFetch?.(query);

    query
      .get(pagination.next())
      .fetch<UnwrapRef<T[]>>() //fix to trick TS to accept the [...value,...response]
      .then((response) => {
        options?.onResponse?.(response);

        items.value = [...items.value, ...response];

        moreDataAvailable.value = false;

        nextTick(() => {
          moreDataAvailable.value = pagination.shouldContinue(response);
        });
      })
      .catch(notification.danger);
  };

  return {
    items,
    getMoreData,
    resetMatches,
    moreDataAvailable,
  };
};
