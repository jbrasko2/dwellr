import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Listing } from '../../../generated/types';
import { ListingGrid } from './listing-grid.component';

const makeListing = (id: string): Listing => ({
    id,
    price: 400000,
    address: {
        street: `${id} Main St`,
        city: 'Austin',
        state: 'TX',
        zip: '78701',
    },
    beds: 3,
    baths: 2,
    sqft: 1500,
    imageUrl: null,
    listingUrl: null,
});

describe('ListingGrid', () => {
    describe('loading state', () => {
        it('renders 6 skeleton placeholders', () => {
            const { container } = render(<ListingGrid listings={[]} loading />);
            const skeletons = container.querySelectorAll('.animate-pulse');
            expect(skeletons).toHaveLength(6);
        });

        it('does not render listings or empty message while loading', () => {
            render(<ListingGrid listings={[]} loading />);
            expect(
                screen.queryByText(/No listings found/),
            ).not.toBeInTheDocument();
        });
    });

    describe('empty state', () => {
        it('shows the empty message when listings is empty', () => {
            render(<ListingGrid listings={[]} loading={false} />);
            expect(screen.getByText(/No listings found/)).toBeInTheDocument();
        });

        it('does not render skeletons in the empty state', () => {
            const { container } = render(
                <ListingGrid listings={[]} loading={false} />,
            );
            expect(container.querySelectorAll('.animate-pulse')).toHaveLength(
                0,
            );
        });
    });

    describe('populated state', () => {
        it('renders a card for each listing', () => {
            const listings = [
                makeListing('1'),
                makeListing('2'),
                makeListing('3'),
            ];
            render(<ListingGrid listings={listings} loading={false} />);
            expect(screen.getAllByRole('link')).toHaveLength(3);
        });

        it('does not show the empty message when listings are present', () => {
            render(
                <ListingGrid listings={[makeListing('1')]} loading={false} />,
            );
            expect(
                screen.queryByText(/No listings found/),
            ).not.toBeInTheDocument();
        });
    });
});
