import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
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
        }, 2500);

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
        <div className="flex gap-2 w-full max-w-2xl">
            <div className="relative flex-1">
                <Input
                    type="text"
                    value={prompt}
                    onChange={setPrompt}
                    onKeyDown={handleKeyDown}
                    size="lg"
                    placeholder=""
                    isDisabled={loading}
                />
                {!prompt && (
                    <div className="pointer-events-none absolute inset-0 flex items-center overflow-hidden px-3.5 select-none">
                        <span
                            className={`truncate text-placeholder text-md transition-opacity duration-300 ${placeholderVisible ? 'opacity-100' : 'opacity-0'}`}
                        >
                            {PLACEHOLDERS[placeholderIndex]}
                        </span>
                    </div>
                )}
            </div>
            <Button
                onClick={handleSubmit}
                isDisabled={loading || !prompt.trim()}
                size="lg"
            >
                {loading ? 'Searching...' : 'Search'}
            </Button>
        </div>
    );
};
