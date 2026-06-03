import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/use-search');

import { useSearch } from '@/hooks/use-search';
import { ResultsPage } from '@/pages/results/results.page';
import { mockSearchResult } from '@/pages/results/results.mock';

const mockUseSearch = vi.mocked(useSearch);

const defaultState = {
    search: vi.fn(),
    loading: false,
    error: undefined,
    result: null,
};

const renderPage = (query = '') =>
    render(
        <MemoryRouter
            initialEntries={[`/results?q=${encodeURIComponent(query)}`]}
        >
            <Routes>
                <Route path="/results" element={<ResultsPage />} />
            </Routes>
        </MemoryRouter>,
    );

describe('ResultsPage', () => {
    beforeEach(() => {
        mockUseSearch.mockReturnValue({ ...defaultState, search: vi.fn() });
    });

    it('renders the search bar', () => {
        renderPage('3 bed house');
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('initializes the search bar with the query param value', () => {
        renderPage('3 bed house');
        expect(screen.getByRole('textbox')).toHaveValue('3 bed house');
    });

    it('calls search with the query param on mount', () => {
        const search = vi.fn();
        mockUseSearch.mockReturnValue({ ...defaultState, search });
        renderPage('3 bed house');
        expect(search).toHaveBeenCalledWith('3 bed house');
    });

    it('does not call search when the query param is empty', () => {
        const search = vi.fn();
        mockUseSearch.mockReturnValue({ ...defaultState, search });
        renderPage('');
        expect(search).not.toHaveBeenCalled();
    });

    it('shows an error message when there is an error', () => {
        mockUseSearch.mockReturnValue({
            ...defaultState,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            error: new Error('oops') as any,
        });
        renderPage('3 bed house');
        expect(
            screen.getByText('Something went wrong. Please try again.'),
        ).toBeInTheDocument();
    });

    it('does not show an error message when there is no error', () => {
        renderPage('3 bed house');
        expect(
            screen.queryByText('Something went wrong. Please try again.'),
        ).not.toBeInTheDocument();
    });

    it('does not render listing cards when result is null', () => {
        renderPage('some query');
        // Only the header nav link should be present — no listing cards
        expect(screen.getAllByRole('link')).toHaveLength(1);
    });

    it('renders listing cards when result is available', () => {
        mockUseSearch.mockReturnValue({
            ...defaultState,
            result: mockSearchResult,
        });
        renderPage('3 bed house');
        // Header link + one link per listing card
        expect(screen.getAllByRole('link')).toHaveLength(
            1 + mockSearchResult.listings.length,
        );
    });
});
