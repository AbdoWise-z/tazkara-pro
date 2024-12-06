import {
  useInfiniteQuery,
  QueryFunction,
  QueryKey
} from '@tanstack/react-query';

interface PollingProviderProps {
  queryKey: QueryKey;
  endpoint: string;
  interval?: number;
  enabled?: boolean;
  pageSize?: number;
}

interface PageData<T> {
  data: T[];
  nextPage: number | null;
}

export function usePolling<T>({
                                        queryKey,
                                        endpoint,
                                        interval = 5000,
                                        enabled = true,
                                        pageSize = 10
                                      }: PollingProviderProps) {
  const fetchPage: QueryFunction<PageData<T>, QueryKey, number> =
    async ({ pageParam = 1 }) => {
      const response = await fetch(
        `${endpoint}?page=${pageParam}&pageSize=${pageSize}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: PageData<T> = await response.json();
      return data;
    };

  return useInfiniteQuery({
    queryKey,
    queryFn: fetchPage,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchInterval: interval,
    enabled,
  });
}