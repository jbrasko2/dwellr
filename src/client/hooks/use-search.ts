import { useLazyQuery } from '@apollo/client/react';
import type { SearchResult } from '../../generated/types';
import { SEARCH_LISTINGS } from '@/grapqhl/queries/search';

export type SearchData = {
    search: SearchResult;
};

export const useSearch = () => {
    const [executeSearch, { loading, error, data }] =
        useLazyQuery<SearchData>(SEARCH_LISTINGS);

    const search = (prompt: string) => {
        executeSearch({ variables: { prompt } });
    };

    return {
        search,
        loading,
        error,
        result: data?.search ?? null,
    };
};
