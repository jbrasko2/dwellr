import { useLazyQuery } from '@apollo/client/react';
import { SEARCH_LISTINGS } from '@/grapqhl/queries/search';
import { mockSearchResult } from '@/pages/results/results.mock';
import type { SearchFiltersInput, SearchResult } from '@generated/types';

export type SearchData = {
    searchListings: SearchResult;
};

export const useSearch = () => {
    const [executeSearch, { loading, error, data }] =
        useLazyQuery<SearchData>(SEARCH_LISTINGS);

    const search = (
        args: { prompt: string } | { filters: SearchFiltersInput },
    ) => {
        executeSearch({ variables: args });
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
        result: data?.searchListings ?? null,
    };
};
