import { QueryDefinition } from '@reduxjs/toolkit/dist/query';
import { QueryHooks } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { useEffect, useRef, useState } from 'react';

// infer result type from endpoint - there is probably a better way of doing this
type GetResultTypeFromEndpoint<Endpoint> = Endpoint extends QueryHooks<
        QueryDefinition<any, any, string, infer ResultType, string>
        >
    ? ResultType
    : never;

interface UseInfiniteQueryOptions<ResultType> {
    getNextPageParam(lastPage: ResultType): any;
}

export function useInfiniteQuery<
    Endpoint extends QueryHooks<QueryDefinition<any, any, any, any, any>>,
    ResultType = GetResultTypeFromEndpoint<Endpoint>
    >(endpoint: Endpoint, options: UseInfiniteQueryOptions<ResultType>) {
    const nextPage = useRef<number | undefined>(undefined);
    const [pages, setPages] = useState<Array<ResultType> | undefined>(undefined);
    const [trigger, result] = endpoint.useLazyQuery();

    useEffect(() => {
        trigger({ page: undefined });
    }, []);

    useEffect(() => {
        if (!result.isSuccess) return;
        nextPage.current = options.getNextPageParam(result.data);
        setPages([...(pages ?? []), result.data]);
    }, [result.data]);

    return {
        ...result,
        data: pages,
        isLoading: result.isFetching && pages === undefined,
        hasNextPage: nextPage.current !== undefined,
        fetchNextPage() {
            if (nextPage.current !== undefined) {
                trigger({ page: nextPage.current });
            }
        },
    };
}