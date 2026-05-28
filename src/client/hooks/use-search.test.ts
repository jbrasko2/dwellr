import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { executeSearchMock, queryState } = vi.hoisted(() => {
    const executeSearchMock = vi.fn();
    const queryState: Record<string, unknown> = {
        loading: false,
        error: undefined,
        data: undefined,
    };
    return { executeSearchMock, queryState };
});

vi.mock('@apollo/client/react', () => ({
    useLazyQuery: () => [executeSearchMock, queryState],
}));

import { useSearch } from './use-search';

describe('useSearch', () => {
    beforeEach(() => {
        executeSearchMock.mockReset();
        queryState.loading = false;
        queryState.error = undefined;
        queryState.data = undefined;
    });

    it('returns null result when no data is available', () => {
        const { result } = renderHook(() => useSearch());
        expect(result.current.result).toBeNull();
    });

    it('exposes loading state from the query', () => {
        queryState.loading = true;
        const { result } = renderHook(() => useSearch());
        expect(result.current.loading).toBe(true);
    });

    it('exposes error state from the query', () => {
        const error = new Error('Network error');
        queryState.error = error;
        const { result } = renderHook(() => useSearch());
        expect(result.current.error).toBe(error);
    });

    it('calls executeSearch with the prompt as a variable', () => {
        const { result } = renderHook(() => useSearch());
        act(() => {
            result.current.search('3 bed in Austin');
        });
        expect(executeSearchMock).toHaveBeenCalledWith({
            variables: { prompt: '3 bed in Austin' },
        });
    });

    it('maps data.search to result when data is present', () => {
        const mockSearch = {
            listings: [],
            total: 0,
            filters: { features: [] },
        };
        queryState.data = { searchListings: mockSearch };
        const { result } = renderHook(() => useSearch());
        expect(result.current.result).toEqual(mockSearch);
    });
});
