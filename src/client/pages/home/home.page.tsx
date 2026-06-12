import { useEffect, useState, type FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/header.component';
import { PageWrapper } from '@/components/layout/page-wrapper.component';
import { SearchBar } from '@/components/search-bar/search-bar.component';
import { useTypewriter } from '@/hooks/use-typewriter';

const HEADING = 'Find your next home';
const ACCENT = 'home';
const ACCENT_START = HEADING.length - ACCENT.length;
const SUBTITLE = "Describe what you're looking for in plain English";
const HEADING_SPEED_MS = 60;
const SUBTITLE_SPEED_MS = 40;
const SUBTITLE_DELAY_MS = HEADING.length * HEADING_SPEED_MS + 300;

const EXAMPLES = [
    'Pet-friendly condo in Denver',
    'Craftsman with a porch in Portland',
    'New build under $400k in Austin',
];

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
            className={`text-brand-500 transition-opacity duration-75 ${cursorOn ? 'opacity-100' : 'opacity-0'}`}
        >
            |
        </span>
    );

    return (
        <>
            <Header />
            <PageWrapper>
                <section className="relative flex min-h-[78vh] flex-col items-center justify-center gap-10 text-center">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 -z-10"
                    >
                        <div className="absolute top-0 left-1/2 h-120 w-120 -translate-x-1/2 -translate-y-1/4 rounded-full bg-[radial-gradient(closest-side,var(--color-brand-200),transparent)] opacity-50 blur-3xl dark:opacity-15" />
                        <div className="animate-drift absolute top-[12%] right-[6%] hidden h-64 w-40 rounded-t-full border border-brand-900/10 lg:block dark:border-cream/10" />
                        <div className="animate-drift absolute bottom-[10%] left-[5%] hidden h-44 w-28 rounded-t-full border border-sand/70 [animation-delay:-8s] lg:block dark:border-sand/30" />
                    </div>

                    <p className="animate-rise text-xs font-semibold tracking-[0.3em] text-brand-600 uppercase dark:text-brand-300">
                        Natural-language home search
                    </p>

                    <div>
                        <h1 className="font-display min-h-[1.15em] text-5xl font-medium tracking-tight text-brand-900 sm:text-7xl dark:text-cream">
                            {heading.displayed.slice(0, ACCENT_START)}
                            <span className="text-brand-600 italic dark:text-brand-300">
                                {heading.displayed.slice(ACCENT_START)}
                            </span>
                            {!heading.done && cursor}
                        </h1>
                        <p className="mt-5 min-h-7 text-lg text-brand-900/60 sm:text-xl dark:text-cream/60">
                            {subtitle.displayed}
                            {subtitle.displayed.length > 0 &&
                                !subtitle.done &&
                                cursor}
                        </p>
                    </div>

                    <div className="animate-rise flex w-full justify-center [animation-delay:150ms]">
                        <SearchBar onSearch={handleSearch} />
                    </div>

                    <div className="animate-rise flex flex-wrap items-center justify-center gap-2 [animation-delay:280ms]">
                        <span className="mr-1 text-xs font-semibold tracking-[0.2em] text-brand-900/35 uppercase dark:text-cream/35">
                            Try
                        </span>
                        {EXAMPLES.map((example) => (
                            <button
                                key={example}
                                type="button"
                                onClick={() => handleSearch(example)}
                                className="cursor-pointer rounded-full border border-brand-900/15 bg-white/60 px-4 py-1.5 text-sm text-brand-800 transition-all hover:border-brand-500/60 hover:bg-brand-50 hover:text-brand-900 dark:border-cream/15 dark:bg-brand-900/60 dark:text-cream/80 dark:hover:bg-brand-900"
                            >
                                {example}
                            </button>
                        ))}
                    </div>

                    <div className="animate-rise mt-2 flex items-center gap-4 text-[11px] font-medium tracking-[0.2em] text-brand-900/35 uppercase [animation-delay:420ms] dark:text-cream/35">
                        <span>Plain English in</span>
                        <span className="size-1 rounded-full bg-sand" />
                        <span>Real listings out</span>
                        <span className="size-1 rounded-full bg-sand" />
                        <span>Zero filter fiddling</span>
                    </div>
                </section>
            </PageWrapper>
        </>
    );
};
