import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchBar } from './search-bar.component';

describe('SearchBar', () => {
    it('renders input and search button', () => {
        render(<SearchBar onSearch={vi.fn()} />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Search' }),
        ).toBeInTheDocument();
    });

    it('calls onSearch with trimmed value on button click', async () => {
        const onSearch = vi.fn();
        render(<SearchBar onSearch={onSearch} />);

        await userEvent.type(screen.getByRole('textbox'), '3 bed in Austin');
        await userEvent.click(screen.getByRole('button', { name: 'Search' }));

        expect(onSearch).toHaveBeenCalledOnce();
        expect(onSearch).toHaveBeenCalledWith('3 bed in Austin');
    });

    it('calls onSearch on Enter key press', async () => {
        const onSearch = vi.fn();
        render(<SearchBar onSearch={onSearch} />);

        await userEvent.type(screen.getByRole('textbox'), '2 bed condo{Enter}');

        expect(onSearch).toHaveBeenCalledOnce();
        expect(onSearch).toHaveBeenCalledWith('2 bed condo');
    });

    it('does not call onSearch when input is empty or whitespace', async () => {
        const onSearch = vi.fn();
        render(<SearchBar onSearch={onSearch} />);

        await userEvent.click(screen.getByRole('button', { name: 'Search' }));
        await userEvent.type(screen.getByRole('textbox'), '   {Enter}');

        expect(onSearch).not.toHaveBeenCalled();
    });

    it('disables input and button when loading', () => {
        render(<SearchBar onSearch={vi.fn()} loading />);

        expect(screen.getByRole('textbox')).toBeDisabled();
        expect(
            screen.getByRole('button', { name: 'Searching...' }),
        ).toBeDisabled();
    });

    it('disables search button when input is empty', () => {
        render(<SearchBar onSearch={vi.fn()} />);
        expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
    });
});
