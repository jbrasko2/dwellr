import { HomePage } from '@/pages/home/home.page';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

const renderPage = () =>
    render(
        <MemoryRouter>
            <HomePage />
        </MemoryRouter>,
    );

describe('HomePage', () => {
    it('renders the main heading', () => {
        renderPage();
        expect(
            screen.getByRole('heading', { name: 'Find your next home' }),
        ).toBeInTheDocument();
    });

    it('renders the descriptive subheading', () => {
        renderPage();
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
