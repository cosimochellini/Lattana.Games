import { nextTick, ref, UnwrapRef } from "vue";
import { notificationService } from "@/services/notificationService";
import { PaginationBuilder, QueryBuilder } from "@/utils/sanityQueryBuilder";

export const useInfiniteLoading = <T>(
  query: QueryBuilder,
  options: Partial<{
    page: number;
    pageSize: number;
    onFetch: (qb: QueryBuilder) => void;
    onResponse: (items: UnwrapRef<T[]>) => void;
    onReset: (items: UnwrapRef<T[]>) => void;
  }> | null = null
) => {
  const items = ref([] as T[]);
  const moreDataAvailable = ref(true);
  const pagination = new PaginationBuilder(options?.page, options?.pageSize);
  const resetMatches = () => {
    pagination.resetPage();
    options?.onReset?.(items.value);
    items.value = [];
    moreDataAvailable.value = true;
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
      .catch(notificationService.danger);
  };

  return {
    items,
    getMoreData,
    resetMatches,
    moreDataAvailable,
  };
};
