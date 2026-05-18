import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Header } from './header.component';

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
