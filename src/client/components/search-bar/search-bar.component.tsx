import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { useState, type FunctionComponent } from 'react';

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

    const handleSubmit = () => {
        if (prompt.trim() === '') return;
        onSearch(prompt);
        setPrompt('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className="flex gap-2 w-full max-w-2xl">
            <Input
                type="text"
                value={prompt}
                onChange={setPrompt}
                onKeyDown={handleKeyDown}
                size="lg"
                placeholder="3 bed house in Austin under $500k with an in-ground pool..."
                isDisabled={loading}
            />
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
