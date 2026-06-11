import { Header } from '@/components/layout/header.component';
import { PageWrapper } from '@/components/layout/page-wrapper.component';
import { SearchBar } from '@/components/search-bar/search-bar.component';
import { useTypewriter } from '@/hooks/use-typewriter';
import { useEffect, useState, type FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

const HEADING = 'Find your next home';
const SUBTITLE = "Describe what you're looking for in plain English";
const HEADING_SPEED_MS = 60;
const SUBTITLE_SPEED_MS = 40;
const SUBTITLE_DELAY_MS = HEADING.length * HEADING_SPEED_MS + 300;

export const HomePage: FunctionComponent = () => {
    const navigate = useNavigate();
    const [cursorOn, setCursorOn] = useState(true);
    const heading = useTypewriter(HEADING, HEADING_SPEED_MS);
    const subtitle = useTypewriter(
        SUBTITLE,
        SUBTITLE_SPEED_MS,
        SUBTITLE_DELAY_MS,
    );

    useEffect(() => {
        if (heading.done && subtitle.done) return;
        const id = setInterval(() => setCursorOn((v) => !v), 530);
        return () => clearInterval(id);
    }, [heading.done, subtitle.done]);

    const handleSearch = (prompt: string) => {
        navigate(`/results?q=${encodeURIComponent(prompt)}`);
    };

    const cursor = (
        <span
            aria-hidden="true"
            className={`transition-opacity duration-75 ${cursorOn ? 'opacity-100' : 'opacity-0'}`}
        >
            |
        </span>
    );

    return (
        <>
            <Header />
            <PageWrapper>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-brand-700 mb-4 min-h-12">
                            {heading.displayed}
                            {!heading.done && cursor}
                        </h1>
                        <p className="text-xl text-brand-500 min-h-7">
                            {subtitle.displayed}
                            {subtitle.displayed.length > 0 &&
                                !subtitle.done &&
                                cursor}
                        </p>
                    </div>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </PageWrapper>
        </>
    );
};
