import { Header } from '@/components/layout/header.component';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

describe('Header', () => {
    it('renders the brand name', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>,
        );
        expect(screen.getByText('dwellr')).toBeInTheDocument();
    });
});
