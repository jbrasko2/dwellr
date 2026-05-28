import { Header } from '@/components/layout/header.component';
import { PageWrapper } from '@/components/layout/page-wrapper.component';
import { SearchBar } from '@/components/search-bar/search-bar.component';
import { type FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage: FunctionComponent = () => {
    const navigate = useNavigate();

    const handleSearch = (prompt: string) => {
        navigate(`/results?q=${encodeURIComponent(prompt)}`);
    };
    return (
        <>
            <Header />
            <PageWrapper>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-brand-700 mb-4">
                            Find your next home
                        </h1>
                        <p className="text-xl text-brand-500">
                            Describe what you're looking for in plain English
                        </p>
                    </div>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </PageWrapper>
        </>
    );
};
