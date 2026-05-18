import { Header } from '@/components/layout/header.component';
import { PageWrapper } from '@/components/layout/page-wrapper.component';
import { ListingGrid } from '@/components/listing-grid/listing-grid.component';
import { SearchBar } from '@/components/search-bar/search-bar.component';
import { useSearch } from '@/hooks/use-search';
import { useEffect, type FunctionComponent } from 'react';
import { useSearchParams } from 'react-router-dom';

export const ResultsPage: FunctionComponent = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const prompt = searchParams.get('q') ?? '';
    const { search, loading, error, result } = useSearch();

    useEffect(() => {
        if (prompt) {
            search(prompt);
        }
    });

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
                            listings={result.listings}
                            loading={loading}
                        />
                    )}
                </div>
            </PageWrapper>
        </>
    );
};
