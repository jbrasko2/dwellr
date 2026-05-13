import { SearchBar } from '@/components/search-bar/search-bar.component';
import { useState, type FunctionComponent } from 'react';

export const App: FunctionComponent = () => {
    const [lastSearch, setLastSearch] = useState('');

    return (
        <div className="min-h-screen bg-cream p-8">
            <h1 className="text-3xl font-bold text-moss-dark mb-8">dwellr</h1>
            <SearchBar onSearch={setLastSearch} />
            {lastSearch && (
                <p className="mt-4 text-moss">Searching for {lastSearch}...</p>
            )}
        </div>
    );
};
