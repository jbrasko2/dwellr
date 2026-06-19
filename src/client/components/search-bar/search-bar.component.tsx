import { ArrowRight, SearchLg } from '@untitledui/icons';
import { useEffect, useState, type FunctionComponent } from 'react';

const PLACEHOLDERS = [
    '3 bed house in Austin under $500k with an in-ground pool...',
    '2 bed condo in Denver with mountain views under $400k...',
    'Studio near downtown Chicago with in-unit laundry under $250k...',
    'Townhouse in Seattle with a 2-car garage under $700k...',
    '4 bed family home in Phoenix with a yard under $600k...',
];

export type SearchBarProps = {
    onSearch: (prompt: string) => void;
    loading?: boolean;
    initialValue?: string;
};

export const SearchBar: FunctionComponent<SearchBarProps> = ({
    onSearch,
    loading = false,
    initialValue = '',
}) => {
    const [prompt, setPrompt] = useState(initialValue);
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [placeholderVisible, setPlaceholderVisible] = useState(true);

    useEffect(() => {
        if (prompt) return;

        let timeoutId: ReturnType<typeof setTimeout>;

        const interval = setInterval(() => {
            setPlaceholderVisible(false);
            timeoutId = setTimeout(() => {
                setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
                setPlaceholderVisible(true);
            }, 300);
        }, 3500);

        return () => {
            clearInterval(interval);
            clearTimeout(timeoutId);
        };
    }, [prompt]);

    const handleSubmit = () => {
        if (prompt.trim() === '') return;
        onSearch(prompt);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="flex w-full max-w-2xl items-center gap-3 rounded-full border border-brand-900/10 bg-white p-2 pl-5 shadow-[0_24px_48px_-16px_rgba(30,46,26,0.18)] transition-all duration-200 focus-within:-translate-y-0.5 focus-within:border-brand-500/50 focus-within:shadow-[0_32px_64px_-16px_rgba(30,46,26,0.28)] dark:border-cream/10 dark:bg-brand-900">
            <SearchLg
                aria-hidden="true"
                className="size-5 shrink-0 text-brand-500 dark:text-brand-300"
            />
            <div className="relative flex-1">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    className="w-full bg-transparent py-2.5 text-md text-brand-900 outline-none disabled:opacity-60 dark:text-cream"
                />
                {!prompt && (
                    <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden select-none">
                        <span
                            className={`truncate text-md text-brand-900/40 transition-opacity duration-300 dark:text-cream/40 ${placeholderVisible ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {PLACEHOLDERS[placeholderIndex]}
                        </span>
                    </div>
                )}
            </div>
            <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !prompt.trim()}
                className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:enabled:bg-brand-700 disabled:cursor-default active:enabled:scale-95 disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-400"
            >
                {loading ? 'Searching...' : 'Search'}
                {!loading && (
                    <ArrowRight aria-hidden="true" className="size-4" />
                )}
            </button>
        </div>
    );
};
