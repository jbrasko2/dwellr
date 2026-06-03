import { Header } from '@/components/layout/header.component';
import { PageWrapper } from '@/components/layout/page-wrapper.component';
import { ListingGrid } from '@/components/listing-grid/listing-grid.component';
import { SearchBar } from '@/components/search-bar/search-bar.component';
import { useSearch } from '@/hooks/use-search';
import type { Listing } from '@generated/types';
import { useEffect, useState, type FunctionComponent } from 'react';
import { useSearchParams } from 'react-router-dom';

type SortKey =
    | 'price_asc'
    | 'price_desc'
    | 'beds_asc'
    | 'beds_desc'
    | 'baths_asc'
    | 'baths_desc'
    | 'sqft_asc'
    | 'sqft_desc';

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
    const sortedListings = result
        ? sortKey
            ? sortListings(result.listings, sortKey)
            : result.listings
        : [];
    

    useEffect(() => {
        if (prompt) {
            search(prompt);
        }
    }, [prompt]);

    const handleSearch = (newPrompt: string) => {
        setSearchParams({ q: newPrompt });
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
                        <ListingGrid
                            listings={
                                sortKey ? sortedListings : result.listings
                            }
                            loading={loading}
                        />
                    )}
                </div>
            </PageWrapper>
        </>
    );
};
