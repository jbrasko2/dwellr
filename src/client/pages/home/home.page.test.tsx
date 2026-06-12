import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HomePage } from '@/pages/home/home.page';

const renderPage = () =>
    render(
        <MemoryRouter>
            <HomePage />
        </MemoryRouter>,
    );

const advancePastTyping = async () => {
    await act(async () => {
        vi.advanceTimersByTime(3500);
    });
};

describe('HomePage', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('renders the main heading', async () => {
        renderPage();
        await advancePastTyping();
        expect(
            screen.getByRole('heading', { name: 'Find your next home' }),
        ).toBeInTheDocument();
    });

    it('renders the descriptive subheading', async () => {
        renderPage();
        await advancePastTyping();
        expect(
            screen.getByText(
                "Describe what you're looking for in plain English",
            ),
        ).toBeInTheDocument();
    });

    it('renders the search bar', () => {
        renderPage();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Search' }),
        ).toBeInTheDocument();
    });
});
