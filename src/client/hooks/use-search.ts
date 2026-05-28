import { useLazyQuery } from '@apollo/client/react';
import type { SearchResult } from '../../generated/types';
import { SEARCH_LISTINGS } from '@/grapqhl/queries/search';
import { mockSearchResult } from '@/pages/results/results.mock';

export type SearchData = {
    search: SearchResult;
};

export const useSearch = () => {
    const [executeSearch, { loading, error, data }] =
        useLazyQuery<SearchData>(SEARCH_LISTINGS);

    const search = (prompt: string) => {
        executeSearch({ variables: { prompt } });
    };

    if (import.meta.env.VITE_USE_MOCK_DATA === 'true') {
        return {
            search: () => {},
            loading: false,
            error: undefined,
            result: mockSearchResult,
        };
    }

    return {
        search,
        loading,
        error,
        result: data?.search ?? null,
    };
};