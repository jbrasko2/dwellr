import type { Listing, SearchFiltersInput } from '@generated/types';
import { useEffect, useState, type FunctionComponent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterPills } from '@/components/filter-pills/filter-pills.component';
import { Header } from '@/components/layout/header.component';
import { PageWrapper } from '@/components/layout/page-wrapper.component';
import { ListingGrid } from '@/components/listing-grid/listing-grid.component';
import { Pagination } from '@/components/pagination/pagination.component';
import { SearchBar } from '@/components/search-bar/search-bar.component';
import {
    SortDropdown,
    type SortKey,
} from '@/components/sort-dropdown/sort-dropdown.component';
import { useSearch } from '@/hooks/use-search';

const PAGE_SIZE = 12;

const sortListings = (listings: Listing[], sortKey: SortKey): Listing[] => {
    return [...listings].sort((a, b) => {
        switch (sortKey) {
            case 'price_asc':
                return (a.price ?? 0) - (b.price ?? 0);
            case 'price_desc':
                return (b.price ?? 0) - (a.price ?? 0);
            case 'beds_asc':
                return (a.beds ?? 0) - (b.beds ?? 0);
            case 'beds_desc':
                return (b.beds ?? 0) - (a.beds ?? 0);
            case 'baths_asc':
                return (a.baths ?? 0) - (b.baths ?? 0);
            case 'baths_desc':
                return (b.baths ?? 0) - (a.baths ?? 0);
            case 'sqft_asc':
                return (a.sqft ?? 0) - (b.sqft ?? 0);
            case 'sqft_desc':
                return (b.sqft ?? 0) - (a.sqft ?? 0);
            default:
                return 0;
        }
    });
};

export const ResultsPage: FunctionComponent = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const prompt = searchParams.get('q') ?? '';
    const { search, loading, error, result } = useSearch();
    const [sortKey, setSortKey] = useState<SortKey | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const sortedListings = result
        ? sortKey
            ? sortListings(result.listings, sortKey)
            : result.listings
        : [];
    const totalPages = Math.ceil(sortedListings.length / PAGE_SIZE);
    const paginatedListings = sortedListings.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE,
    );

    useEffect(() => {
        if (prompt) {
            search({ prompt });
        }
    }, [prompt]);

    const handleSearch = (newPrompt: string) => {
        setCurrentPage(1);
        setSearchParams({ q: newPrompt });
    };

    const handleSortChange = (key: SortKey | null) => {
        setSortKey(key);
        setCurrentPage(1);
    };

    const handleRemoveFilter = (updatedFilters: SearchFiltersInput) => {
        setCurrentPage(1);
        search({ filters: updatedFilters });
    };

    return (
        <>
            <Header />
            <PageWrapper>
                <div className="flex flex-col gap-6">
                    <SearchBar
                        onSearch={handleSearch}
                        loading={loading}
                        initialValue={prompt}
                    />
                    {error && (
                        <p className="text-red-500">
                            Something went wrong. Please try again.
                        </p>
                    )}
                    {result && (
                        <>
                            <FilterPills
                                filters={result.filters}
                                onRemove={handleRemoveFilter}
                            />
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-secondary">
                                    {result.listings.length} listing
                                    {result.listings.length !== 1
                                        ? 's'
                                        : ''}{' '}
                                    found
                                </p>
                                <SortDropdown
                                    value={sortKey}
                                    onChange={handleSortChange}
                                />
                            </div>
                            <ListingGrid
                                listings={paginatedListings}
                                loading={loading}
                            />
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )}
                </div>
            </PageWrapper>
        </>
    );
};
